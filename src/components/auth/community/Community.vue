<template>
  <div style="width: 100%; height: 100%" class="bg">
    <van-nav-bar title="社区" @click-right="onClickRight" fixed placeholder>
      <template #right v-if="isAdmin">
        <van-icon name="plus" size="18" />
      </template>
    </van-nav-bar>
    <van-row style="height: 100%; margin-top: 10px">
      <van-col span="8">
        <van-sidebar v-model="activeKey" style="width: 100%; margin: 0px">
          <van-sidebar-item v-for="item in periodList" :key="item.id" :title="item.periodNumber" />
        </van-sidebar>
        <van-empty description="请添加社区结构" v-if="periodList.length === 0">
          <van-button icon="plus" type="primary" to="add">添加</van-button>
        </van-empty>
      </van-col>

      <van-col span="16" style="background-color: white; height: 100%">
        <van-empty description="暂无详情" v-if="list.length === 0">
        </van-empty>
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="background-color: white">
          <van-list v-model="loading" :finished="finished" :immediate-check="false" finished-text="没有更多了" @load="onLoad">
            <CommunityBuildingInfo v-for="item in list" :key="item.id" :info="item" />
          </van-list>
        </van-pull-refresh>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import { findAllReq, findByPerionIdReq, findUserFunctionReq } from "../../../utils/api";
import CommunityBuildingInfo from "./list/CommunityBuildingInfo";
export default {
  name: "Community",
  components: {
    CommunityBuildingInfo,
  },
  data() {
    return {
      isAdmin: false,
      activeKey: 0,
      periodList: [],
      pageNum: 1,
      pageSize: 5,
      pageData: {},
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
    };
  },
  created() {
    this.loadSideBar();
    this.isAdminCheck()
  },
  watch: {
    activeKey: {
      handler(newValue, oldValue) {
        // 清空数据
        this.list.splice(0, this.list.length)
        this.handlPage()
        // 得到列表数据
        this.getInfoList();
      },
    },
  },
  methods: {
    isAdminCheck() {
      findUserFunctionReq().then(res => {
        if (res.code == 200) {
          let labelArr = res.data.map(item => item.label);
          console.log(labelArr)
          if (labelArr.indexOf("role") > -1) {
            this.isAdmin = true
          }
        }
      })
    },
    onClickRight() {
      this.$router.push({ name: "add" });
    },
    loadSideBar() {
      findAllReq("period").then((res) => {
        this.periodList = res.data;
        this.getInfoList()
      });
    },
    /**得到列表信息 */
    getInfoList() {
      findByPerionIdReq(
        {
          periodId: this.periodList[this.activeKey].id,
          pageNum: this.pageInfo.pageNum,
          pageSize: this.pageInfo.pageSize,
        },
        {}
      ).then((res) => {
        if (res.code === 200) {
          this.pageData = res.data
          res.data.list.forEach(item => {
            this.list.push(item)
          })
        } else {
          this.$toast.fail(res.message);
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
      });
    },
    onRefresh() {
      this.refreshing = true // 加载状态
      this.list.splice(0, this.list.length) // 清空列表
      this.pageInfo.pageSize = 6
      this.pageInfo.pageNum = 1
      this.getInfoList() // 查询列表
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
        this.getInfoList()
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
};
</script>

<style>
</style>