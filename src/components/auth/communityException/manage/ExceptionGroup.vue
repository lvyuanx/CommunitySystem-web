<template>
  <div class="box">
    <form action="/">
      <van-search v-model="query.userName" placeholder="请输入搜索关键词" @search="onSearch" />
    </form>
    <van-field name="radio" label="异常类型">
      <template #input>
        <van-radio-group v-model="query.exceptionType" direction="horizontal">
          <van-radio shape="square" name="">全部</van-radio>
          <van-radio shape="square" name="0">体温</van-radio>
          <van-radio shape="square" name="1">其他</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-pull-refresh class="box" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
        <div v-if="active ==0" class="box">
          <not-started v-for="item in list" :key="item.id" :exceptionInfo="item" />
        </div>
        <div v-if="active ==1" class="box">
          <on-going v-for="item in list" :key="item.id" :exceptionInfo="item" />
        </div>
        <div v-if="active ==2" class="box">
          <end v-for="item in list" :key="item.id" :exceptionInfo="item" />
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { findExceptionReq } from '../../../../utils/api'
import End from './End.vue'
import NotStarted from './NotStarted.vue'
import OnGoing from './OnGoing.vue'
export default {
  props: {
    active: {
      type: Number,//类型
      required: true,//必要性
      default: 0 //默认值
    }
  },
  name: 'ExceptinonGroup',
  components: { NotStarted, End, OnGoing },
  data() {
    return {
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
        status: 0,
        exceptionType: '',
        userName: '',
      }
    }
  },
  watch: {
    query: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.findException() // 查询列表
      }
    },
    active: {
      immediate: true,
      handler() {
        this.query.status = this.active
      }
    }
  },
  created() {
    this.handlPage()
    this.findException() // 查询列表
  },
  mounted() {
    this.$bus.$on("changeList", (id) => { //在总线上创建自定义事件用于接收数据
      if (this.list.length > 0) {
        this.list.forEach((value, index) => {
          if (value.id == id) {
            this.list.splice(index, 1)
          }
        })
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeList") //生命周期结束，销毁自定义事件
  },
  methods: {
    onSearch(val) { // 搜索框查询

    },
    findException() { // 查询列表
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum
      }
      let data = {
        ...this.query
      }
      findExceptionReq(params, data).then(res => {
        if (res.code == 200) {
          this.handlQuery(res.data) // 添加页面信息
          if (res.data.list.length > 0) {
            res.data.list.forEach(value => this.list.push(value))
          }
        } else {
          this.$toast.fail("查询失败")
        }
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
    onRefresh() {
      this.refreshing = true // 加载状态
      this.list.splice(0, this.list.length) // 清空列表
      this.pageInfo.pageSize = 6
      this.pageInfo.pageNum = 1
      this.findException() // 查询列表
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
        this.findException()
      } else {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }
    },
    handlPage() {
      this.pageInfo = {
        pageSize: 6,
        pageNum: 1,
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      }
    }
  },

}
</script>

<style>
</style>