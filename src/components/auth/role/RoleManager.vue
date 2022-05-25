<template>
  <div class="box">
    <van-row>
      <van-col span="20">
        <van-search v-model="findQuery.name" placeholder="请输入搜索关键词" />
      </van-col>
      <van-col span="4" style="background-color: white">
        <van-button class="btnStyle" icon="plus" type="info" @click="onAddBox" plain></van-button>
      </van-col>

      <van-pull-refresh class="box" v-model="refreshing" @refresh="onRefresh">
        <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
          <van-swipe-cell v-for="item in list" :key="item.roleId" style="margin-top:3px">
            <van-cell clickable @click="showRoleResourceBox(item)" :border="false" :title="item.roleName" :value="item.description" />
            <template #right>
              <van-button square type="primary" @click="updateRole(item)" text="修改" />
              <van-button square type="danger" @click="deleteRole(item.roleId)" text="删除" />
            </template>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>

    </van-row>

    <van-dialog v-model="addBoxShow" title="添加角色" show-cancel-button :before-close="beforeClose" @confirm="confirm">
      <van-form @submit="onSubmit" style="padding: 5px">
        <van-field v-model="roleInfo.roleName" name="角色名" label="角色名" placeholder="角色名" :rules="[{ required: true, message: '请填写角色名' }]" />
        <van-field v-model="roleInfo.description" name="角色描述" label="角色描述" placeholder="角色描述" :rules="[{ required: true, message: '请填写角色描述' }]" />
        <van-field v-model="periodName" disabled rows="1" autosize type="textarea" center clearable label="选择期" placeholder="请选择期请输入">
          <template #button>
            <van-button size="small" type="primary" @click="onSelectPeriod">选择</van-button>
          </template>
        </van-field>
      </van-form>
    </van-dialog>
    <role-resource-tab :isShow="roleResourcePopuShow" :roleResource="roleResourceArr" />
    <update-role-box :isShow="isShowUpdateRoleBox" :periodIds="updateRoleInfo" />
  </div>
</template>

<script>
import { findAllCommunityInfoReq, addCommunityRoleReq, findCommunityRoleReq, deleteRoleReq } from '../../../utils/api'
import RoleResourceTab from '../../commons/role/index.vue'
import UpdateRoleBox from '../../commons/role/UpdateRoleBox.vue'
export default {
  name: 'RoleManager',
  data() {
    return {
      updateRoleInfo: {},
      isShowUpdateRoleBox: false,
      roleResourceArr: [],
      roleResourcePopuShow: false,
      addBoxShow: false,
      selectPeriodShow: false,
      period: [],
      echoPeriod: [],
      periodName: '',
      showBox: true,
      roleInfo: {
        roleName: '',
        description: '',
        periodIds: [],
      },
      communityList: [],
      selectIndex: [],
      findQuery: {
        name: ''
      },
      refreshing: false,
      loading: false,
      finished: false,
      error: false,
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      },
      list: [], // 页面列表信息
    }
  },
  components: { RoleResourceTab, UpdateRoleBox },
  watch: {
    findQuery: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.handlPage()
        this.findCommunityRole() // 查询列表
      }
    }
  },
  created() {
    this.findCommunityRole()
  },
  mounted() {
    this.$bus.$on("changeRoleResourcePopuShow", (isShow) => { //在总线上创建自定义事件用于接收数据
      this.roleResourcePopuShow = isShow
    })
    this.$bus.$on("closeUpdateRoleBox", (params) => { //在总线上创建自定义事件用于接收数据
      console.log("params", params)
      if (!params.isOnCancel) {
        this.roleInfo.periodIds = params.result
        this.periodName = params.resultNameStr
      }
      this.isShowUpdateRoleBox = params.isShow
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeRoleResourcePopuShow")
    this.$bus.$off("closeUpdateRoleBox")
  },
  methods: {
    updateRole(item) { // 修改角色
      this.addBoxShow = true
      // if (this.period.length > 0) {
      //   this.period = []
      // }
      this.roleInfo = {
        roleName: item.roleName,
        description: item.description,
        roleId: item.roleId,
        periodIds: item.communityResourceVoList.map(i => i.parentId)
      }
      this.periodName = item.periodNameStr
    },
    onAddBox() {
      this.addBoxShow = true
      this.periodName = ''
      this.roleInfo = {
        roleName: '',
        description: '',
        periodIds: [],
      }
      this.period = []
    },
    confirm() { // 提价点击事件
      if (this.roleInfo.periodIds.length < 1) {
        this.$toast("请先选择要管理的范围！")
        return;
      }
      this.addCommunityRole()
    },
    beforeClose(action, done) { // 提交判断
      if (action == 'confirm' && this.roleInfo.periodIds.length < 1) {
        this.$toast("请先选择要管理的范围！")
        done(false)
      } else {
        done()
      }
    },
    onSubmit() {

    },
    onSelectPeriod() { // 打开选择期的弹窗
      this.updateRoleInfo = {
        date: new Date(),
        periodIds: this.roleInfo.periodIds
      }
      this.isShowUpdateRoleBox = true

    },
    addCommunityRole() { // 添加角色
      addCommunityRoleReq({}, this.roleInfo).then(res => {
        if (res == 200) {
          this.$toast("操作成功")
          this.addCommunityRole()
          this.handlPage()
          this.findCommunityRole() // 查询列表

        } else {
          this.$toast(res.message)
        }
      })
    },
    findCommunityRole() { // 查询角色
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        name: this.findQuery.name
      }
      findCommunityRoleReq(params).then(res => {
        if (res.code == 200) {
          if (res.data.list.length > 0) {
            res.data.list.forEach(item => this.list.push(item))
          }
        } else {
          this.$toast(res.message)
        }
        this.handlQuery(res.data)
        // 结束刷新状态
        this.refreshing = false
        // 加载状态结束
        this.loading = false;
        if (res.data.hasNextPage) {
          this.finished = false
        } else {
          this.finished = true
        }

      })
    },
    deleteRole(roleId) { //删除角色
      deleteRoleReq({ roleId: roleId }).then(res => {
        this.$toast(res.message)
        if (res.code == 200) {
          this.findCommunityRole()
        }
      })
    },
    onRefresh() {
      this.refreshing = true // 加载状态
      this.list.splice(0, this.list.length) // 清空列表
      this.pageInfo.pageSize = 10
      this.pageInfo.pageNum = 1
      this.findCommunityRole() // 查询列表
    },
    handlQuery(data) {
      this.pageInfo.hasNextPage = data.hasNextPage // 是否有下一页
      this.pageInfo.hasPreviousPage = data.hasPreviousPage // 是否有上一页
      this.pageInfo.isFirstPage = data.isFirstPage // 是否第一页
      this.pageInfo.isLastPage = data.isLastPage // 是否最后一页
    },
    onLoad() {
      // 判断是否有下一页
      if (this.pageInfo.hasNextPage) {
        this.loading = true
        // 页码+1
        this.pageInfo.pageNum++
        // 调用查询方法
        this.findCommunityRole()
      } else {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }
    },
    handlPage() {
      this.pageInfo = {
        pageSize: 10,
        pageNum: 1,
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      }
    },
    showRoleResourceBox(item) {
      this.roleResourceArr = item.communityResourceVoList
      this.roleResourcePopuShow = true
    }
  }
}
</script>

<style scoped>
.btnStyle {
  margin: 5px;
}
.selectBuildingBox {
  height: 60%;
  padding: 10% 10px 10% 10px;
}
</style>