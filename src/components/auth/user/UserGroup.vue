<template>
  <div class="box">
    <van-search v-model="query.searchName" placeholder="请输入搜索关键词" />
    <van-pull-refresh v-model="refreshing" success-text="刷新成功" @refresh="onRefresh">
      <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
        <div v-if="active == 0" class="box">
          <community-user-info v-for="item in list" :key="item.userId" :userInfo="item" />
        </div>
        <div v-if="active ==1" class="box">
          <admin-user-info v-for="item in list" :key="item.userId" :userInfo="item" />
        </div>
        <div v-if="active ==2" class="box">
          <other-user-info v-for="item in list" :key="item.userId" :userInfo="item" />
        </div>

      </van-list>
    </van-pull-refresh>
    <select-address :isShow="showSelectAddress" :userId="selectUserId" />
  </div>
</template>

<script>
import { findUserListReq, updateHouseholdUserReq } from '../../../utils/api'
import NavTopBar from '../../commons/NavTopBar.vue'
import CommunityUserInfo from './CommunityUserInfo.vue'
import OtherUserInfo from './OtherUserInfo.vue'
import AdminUserInfo from './AdminUserInfo.vue'
import SelectAddress from '../../commons/address/index.vue'
export default {
  props: {
    active: {
      type: Number,//类型
      required: false,//必要性
      default: 0 //默认值
    }
  },
  name: "UserGroup",
  components: { NavTopBar, CommunityUserInfo, OtherUserInfo, AdminUserInfo, SelectAddress },
  data() {
    return {
      showSelectAddress: false,
      selectUserId: '',
      isAdmin: false,
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
        status: this.active,
        searchName: '',
      }

    }
  },
  mounted() {
    this.$bus.$on("showSelectAddress", (params) => { //在总线上创建自定义事件用于接收数据
      this.showSelectAddress = params.isShow
      this.selectUserId = params.userId
    })

    this.$bus.$on("changeShow", (isShow) => { //在总线上创建自定义事件用于接收数据
      this.showSelectAddress = isShow
    })

    this.$bus.$on("changeAddress", (params) => { //在总线上创建自定义事件用于接收数据
      let { selectedOptions, userId, householdId } = params
      // 修改用户户关联关系
      this.updateHouseholdUser(userId, householdId);
    })
  },
  created() {
    this.findUserHousehold()
  },
  beforeDestroy() {
    this.$bus.$off("showSelectAddress")
    this.$bus.$off("changeShow")
    this.$bus.$off("changeAddress")
  },
  computed: {

  },
  watch: {
    query: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler() { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.findUserHousehold() // 查询列表
      }
    },
    active: {
      immediate: true,
      handler() {
        this.query.status = this.active
      }
    }
  },
  methods: {
    changeList(userId) {
      if (this.list.length > 0) {
        this.list.forEach((value, index) => {
          if (value.userId == userId) {
            this.list.splice(index, 1)
          }
        })
      }
    },
    updateHouseholdUser(userId, householdId) { // 修改用户户关联关系
      let params = {
        userId: userId,
        householdId: householdId
      }
      updateHouseholdUserReq(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("修改成功")
          this.list.splice(0, this.list.length)
          this.handlPage()
          this.findUserHousehold()
        } else {
          this.$toast.fail("修改失败")
        }
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
      this.handlPage() // 初始化查询参数
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
          this.finished = false
        }
      })
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
  }
}
</script>

<style scoped>
</style>