<template>
  <div class="box">
    <form action="/">
      <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch" />
    </form>
    <van-pull-refresh class="box" v-model="refreshing" @refresh="onRefresh">
      <van-list v-model="loading" :immediate-check="false" :error.sync="error" :finished="finished" finished-text="没有更多了" error-text="请求失败，点击重新加载" @load="onLoad">
        <van-swipe-cell v-for="item in list" :key="item.userId">
          <div class="itemBox">
            <van-row class="rowBox">
              <van-col class="imageBox" span="8" :style="{'background-image': 'url(' + item.avatarUrl + ')'}">
              </van-col>
              <van-col span="16">
                <ul>
                  <li><strong class="titleBox">姓名：</strong>{{item.user.realName}}</li>
                  <li><strong class="titleBox">电话：</strong>{{item.user.mobil}}</li>
                  <li>
                    <van-divider :style="{ marginTop: '3px', marginBottom: '0px', color: '#1989fa', borderColor: '#1989fa' }">住址</van-divider>
                  </li>
                  <li>
                    <van-button plain type="info" @click="showPopup(item.userId)">{{item.periodNumber}} / {{item.buildingNumber}} / {{item.unitNumber}} / {{item.layerNumber}} / {{item.householdNumber}}</van-button>
                  </li>
                </ul>
              </van-col>
            </van-row>
          </div>

          <template #right>
            <van-button square text="通过" @click="householdExamination(item.userId, 1)" type="primary" class="success-button" />
            <van-button square text="拒绝" @click="householdExamination(item.userId, 0)" type="danger" class="delete-button" />
          </template>
        </van-swipe-cell>
      </van-list>
    </van-pull-refresh>
    <select-address :isShow="showSelectAddress" :userId="selectUserId" />
  </div>
</template>

<script>
import { findUserHouseholdReq, getImageReq, updateHouseholdUserReq, householdExaminationReq } from '../../../utils/api'
import SelectAddress from '../../commons/address/index.vue'
export default {
  name: "UserInHousehold",
  data() {
    return {
      list: [],
      error: false,
      loading: false,
      value: '',
      refreshing: false,
      finished: false,
      showSelectAddress: false,
      selectUserId: '',
      queryBo: {
        pageNum: 1, // 起始页
        pageSize: 5, // 页面大小
        userName: '',
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      }
    };
  },
  components: { SelectAddress },
  created() {
    this.findUserHousehold() // 查询审批用户
  },
  mounted() {
    this.$bus.$on("changeShow", (isShow) => { //在总线上创建自定义事件用于接收数据
      this.showSelectAddress = isShow
    })
    this.$bus.$on("changeAddress", (params) => { //在总线上创建自定义事件用于接收数据
      let { selectedOptions, userId, householdId } = params
      // 修改用户户关联关系
      this.updateHouseholdUser(userId, householdId);
      console.log(selectedOptions)
      if (this.list.length > 0) {
        this.list.forEach((element, index) => {
          if (element.userId == userId) {
            this.list[index].periodNumber = selectedOptions[0].text
            this.list[index].buildingNumber = selectedOptions[1].text
            this.list[index].unitNumber = selectedOptions[2].text
            this.list[index].layerNumber = selectedOptions[3].text
            this.list[index].householdNumber = selectedOptions[4].text
          }
        })
      }
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeShow") //生命周期结束，销毁自定义事件
    this.$bus.$off("changeAddress") //生命周期结束，销毁自定义事件
  },
  methods: {
    onLoad() { // 加载列表数据
      // 判断是否有下一页
      if (this.queryBo.hasNextPage) {
        this.loading = true
        // 页码+1
        this.queryBo.pageNum++
        // 调用查询方法
        this.findUserHousehold()
      } else {
        // 加载状态结束
        this.loading = false;
        // 数据全部加载完成
        this.finished = true;
      }
    },
    onRefresh() { // 刷新页码数据
      this.handlQuery()
      // 加载状态结束
      this.loading = true;
      // 数据全部加载完成
      this.finished = false;
      // 清空列表
      if (this.list.length > 0) {
        this.list.splice(0, this.list.length)
      }
      // 重新加载列表
      this.findUserHousehold()
    },
    onSearch(val) {
      this.handlQuery()
      this.queryBo.userName = val
      if (this.list.length > 0) {
        this.list.splice(0, this.list.length)
      }
      this.findUserHousehold()
    },
    findUserHousehold() {
      let queryData = {
        userName: this.queryBo.userName
      }
      let queryParams = {
        pageNum: this.queryBo.pageNum,
        pageSize: this.queryBo.pageSize
      }
      findUserHouseholdReq(queryParams, queryData).then(res => {
        if (res.code == 200) {
          this.queryBo.hasNextPage = res.data.hasNextPage // 是否有下一页
          this.queryBo.hasPreviousPage = res.data.hasPreviousPage // 是否有上一页
          this.queryBo.isFirstPage = res.data.isFirstPage // 是否第一页
          this.queryBo.isLastPage = res.data.isLastPage // 是否最后一页
          this.loading = false
          this.refreshing = false
          let arrList = res.data.list
          if (arrList.length > 0) {
            arrList.forEach(element => {
              element.avatarUrl = '/img/default/defaultHead.png'
              let avatar;
              if (element.user.avatar !== null) {
                avatar = element.user.avatar;
                this.createUrl(avatar, element.userId)
              }
              this.list.push(element)
            });
          }
        } else {
          this.$toast(res.message)
        }
        if (this.list.length == 0) {
          this.finished = true
        }
      })
    },
    createUrl(avatar, userId) {
      getImageReq(
        {
          path: avatar,
        },
        {}
      ).then((r) => {
        let url = window.URL.createObjectURL(r);
        this.list.forEach((element, index) => {
          if (element.userId == userId) {
            element.avatarUrl = url
            this.list.splice(index, 1, element)
          }
        })
      });
    },
    handlQuery() {
      this.queryBo = { // 初始化查询条件
        pageNum: 1, // 起始页
        pageSize: 5, // 页面大小
        userName: this.queryBo.userName,
        hasNextPage: false, // 是否有下一页
        hasPreviousPage: false, // 是否有上一页
        isFirstPage: true, // 是否第一页
        isLastPage: true, // 是否最后一页
      }
    },
    showPopup(userId) {
      this.showSelectAddress = true
      this.selectUserId = userId
    },
    updateHouseholdUser(userId, householdId) {
      let params = {
        userId: userId,
        householdId: householdId
      }
      updateHouseholdUserReq(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("修改成功")
        } else {
          this.$toast.fail("修改失败")
        }
      })
    },
    householdExamination(userId, examineStatus) { // 住户审批
      householdExaminationReq({
        userId: userId,
        examineStatus: examineStatus
      }).then(res => {
        if (res.code == 200) {
          this.list.forEach((value, index) => {
            if (value.userId == userId) {
              this.list.splice(index, 1)
            }
            this.$toast.success("操作成功")
          })
        } else {
          this.$toast.fail("操作失败")
        }
      })
    }
  },
};
</script>

<style scoped>
.goods-card {
  margin: 0;
  background-color: white;
}
.success-button {
  height: 100%;
}
.delete-button {
  height: 100%;
}
.imageBox {
  display: inline-block;
  vertical-align: top;
  width: 110px; /* 容器必须设置宽高 */
  height: 110px;
  background-size: cover;
  background-position: center center;
  border: 1px solid #eee;
  border-radius: 5px;
  margin: 5px;
}
.itemBox {
  height: 100%;
  width: 100%;
  background-color: white;
  height: 100%;
  margin-top: 3px;
}
.rowBox {
  height: 100%;
}
.colBox {
  height: 100%;
}
li {
  font-size: 14px;
  margin-bottom: 2px;
}
ul {
  padding: 5px;
}
</style>
