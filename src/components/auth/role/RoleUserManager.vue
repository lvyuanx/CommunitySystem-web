<template>
  <div class="box">
    <van-row>
      <van-col span="24">
        <van-search v-model="query.searchName" placeholder="请输入搜索关键词" />
      </van-col>
    </van-row>
    <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
      <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
        <admin-user-info v-for="item in list" :key="item.userId" :userInfo="item" />
      </van-list>
    </van-pull-refresh>
    <change-user-role :isShow="showChageRole" :userId="selectUserId" />
  </div>
</template>

<script>
import { findUserListReq, editUserRoleReq } from '../../../utils/api'
import AdminUserInfo from './AdminUserInfo.vue'
import ChangeUserRole from './ChangeUserRole.vue'
export default {
  name: 'RoleUserManager',
  data() {
    return {
      selectUserId: '',
      showChageRole: false,
      refreshing: false,
      loading: false,
      finished: false,
      error: false,
      pageInfo: {
        pageSize: 6,
        pageNum: 1,
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      },
      list: [], // 页面列表信息
      query: {
        status: 3,
        searchName: '',
      }
    }
  },
  components: { AdminUserInfo, ChangeUserRole },
  watch: {
    query: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.findUserHousehold() // 查询列表
      }
    }
  },
  created() {
    this.findUserHousehold()
  },
  mounted() {
    this.$bus.$on("changeShow", (data) => { //在总线上创建自定义事件用于接收数据
      console.log(data)
      this.showChageRole = data.show
      this.selectUserId = data.userId
    })
    this.$bus.$on("changeUserRole", (data) => { //在总线上创建自定义事件用于接收数据
      let roleIds = data.roleList.map(item => item.roleId);
      let roleIdStr = roleIds.join(",")
      this.editUserRole(data.userId, roleIdStr)
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeShow") //生命周期结束，销毁自定义事件
    this.$bus.$off("changeUserRole")
  },
  methods: {
    editUserRole(userId, roleIdStr) {
      editUserRoleReq({ userId: userId, roleIdStr: roleIdStr }).then(res => {
        this.$toast(res.message)
      })
    },
    onLoad() {
      // 判断是否有下一页
      if (this.pageInfo.hasNextPage) {
        this.loading = true
        // 页码+1
        this.pageInfo.pageNum++
        // 调用查询方法
        this.findUserHousehold()
      } else {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }
    },
    onRefresh() {
      this.refreshing = true // 加载状态
      this.list.splice(0, this.list.length) // 清空列表
      this.pageInfo.pageSize = 6
      this.pageInfo.pageNum = 1
      this.findUserHousehold() // 查询列表
    },
    onSearch(val) { // 搜索框查询

    },
    handlQuery(data) {
      this.pageInfo.hasNextPage = data.hasNextPage // 是否有下一页
      this.pageInfo.hasPreviousPage = data.hasPreviousPage // 是否有上一页
      this.pageInfo.isFirstPage = data.isFirstPage // 是否第一页
      this.pageInfo.isLastPage = data.isLastPage // 是否最后一页
    },
    findUserHousehold() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }

      let data = {
        ...this.query
      }
      findUserListReq(params, data).then(res => {
        if (res.code == 200) {
          if (res.data.list.length > 0) {
            res.data.list.forEach(value => {
              this.list.push(value)
            })
          }
        } else {
          this.$toast("查询用户失败")
        }
        this.handlQuery(res.data) // 添加页面信息
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
    }
  }
}
</script>

<style>
</style>