<template>
  <div class="box">
    <van-dialog v-model="show" title="选择用户" show-cancel-button :before-close="beforeClose" @confirm="confirm" @close="closePoup" @open="openPoup">
      <van-row>
        <van-col span="24">
          <van-search v-model="findQuery.name" placeholder="请输入搜索关键词" />
        </van-col>
      </van-row>
      <van-row>
        <van-col :style="checkBoxsBox" span="24">
          <van-pull-refresh class="box" :style="checkBoxsBox" v-model="refreshing" @refresh="onRefresh">
            <van-list v-model="loading" :immediate-check="true" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
              <van-checkbox-group v-model="result" ref="checkboxGroup">
                <van-cell-group>
                  <van-cell v-for="(item, index) in list" clickable :key="item.id" :title="item.realName + '\t ( ' + item.email + ' ) ' " @click="toggle(index)">
                    <template #right-icon>
                      <van-checkbox :name="item" ref="checkboxes" />
                    </template>
                  </van-cell>
                </van-cell-group>
              </van-checkbox-group>
            </van-list>
          </van-pull-refresh>
        </van-col>
      </van-row>
      <van-row type="flex" justify="end" style="padding: 3px">
        <van-button type="primary" class="btnStyle" size="small" @click="checkAll">全选</van-button>
        <van-button type="info" class="btnStyle" size="small" @click="toggleAll">反选</van-button>

      </van-row>
    </van-dialog>
  </div>
</template>

<script>
import { findAllUserReq } from '../../../utils/api'
export default {
  props: {
    isShow: {
      type: Boolean,//类型
      required: true,//必要性
      default: false //默认值
    },

  },
  name: "SelectUser",
  data() {
    return {
      result: [],
      checkBoxsBox: {
        height: '200px',
        overflow: 'auto',
      },
      show: false,
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
      findQuery: {
        name: ''
      },
      list: [], // 页面列表信息
    }
  },
  watch: {
    show: {
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        if (newValue) {
        }
      }
    },
    isShow: {
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.show = newValue
      }
    },
    findQuery: {
      deep: true, // 深度监视
      immediate: false, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        this.list.splice(0, this.list.length)
        this.handlPage()
        this.findAllUser() // 查询列表
      }
    }
  },
  created() {
    this.findAllUser() // 查询所有用户
  },
  methods: {
    checkAll() {
      this.$refs.checkboxGroup.toggleAll(true);
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll();
    },
    findAllUser() {
      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        name: this.findQuery.name
      }
      findAllUserReq(params).then(res => {
        if (res.code == 200) {
          console.log(res)
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
    confirm() { // 提交点击事件
      if (this.result.length < 1) {
        this.$toast("请先选择用户")
        return;
      }
      this.$bus.$emit("selectUserReslut", this.result) //使用自定义事件传递数据
    },
    beforeClose(action, done) { // 提交判断
      if (action == 'confirm' && this.result.length < 1) {
        this.$toast("请先选择用户")
        done(false)
      } else {
        done()
      }
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    closePoup() {
      this.$bus.$emit("changeShow", false) //使用自定义事件传递数据
    },
    openPoup() {
    },
    onRefresh() {
      this.refreshing = true // 加载状态
      this.list.splice(0, this.list.length) // 清空列表
      this.pageInfo.pageSize = 6
      this.pageInfo.pageNum = 1
      this.findAllUser() // 查询列表
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
        this.findAllUser()
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

<style scoped>
.btnStyle {
  margin: 8px 15px 8px 0px;
}
</style>