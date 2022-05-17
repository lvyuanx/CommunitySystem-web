<template>
  <div class="box">
    <van-field name="radio" label="提交类型">
      <template #input>
        <van-radio-group v-model="query.isEnable" direction="horizontal">
          <van-radio name="">全部</van-radio>
          <van-radio name="1">未失效</van-radio>
          <van-radio name="0">失效</van-radio>
        </van-radio-group>
      </template>
    </van-field>
    <van-pull-refresh class="box" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
        <record-item v-for="item in list" :key="item.emailId" :active="active" :recordInfo="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { trFindListReq } from '../../../utils/api'
import RecordItem from './RecordItem.vue'
export default {

  props: {
    active: {
      type: Number,//类型
      required: true,//必要性
      default: 0 //默认值
    }
  },
  components: { RecordItem },
  name: 'RecordGroup',
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
        isHealth: 0,
        isEnable: '',
      },
    }
  },
  watch: {
    query: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.handlPage()
        this.trFindList() // 查询列表
      }
    },
    active: {
      immediate: true,
      handler() {
        this.query.isHealth = this.active
      }
    }
  },
  created() {
    this.trFindList()
  },
  methods: {
    trFindList() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        isHealth: this.query.isHealth,
        isEnable: this.query.isEnable
      }
      trFindListReq(params).then(res => {
        if (res.code == 200) {
          console.log(res)
          this.handlQuery(res.data) // 添加页面信息
          if (res.data.list.length > 0) {
            res.data.list.forEach(value => this.list.push(value))
          }
        } else {
          this.$toast(res.message)
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
      this.trFindList() // 查询列表
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
        this.trFindList()
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
  }
}
</script>

<style>
</style>