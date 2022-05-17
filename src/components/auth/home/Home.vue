<template>
  <div style="width: 100%">
    <NavTopBar title="首页" :leftArrow="false" :rightArrow="false" />
    <van-swipe class="my-swipe" :autoplay="3000" style="height: 200px" indicator-color="white">
      <van-swipe-item>
        <img src="../../../assets/img/hb/hb2.jpg" />
      </van-swipe-item>
      <van-swipe-item>
        <img src="../../../assets/img/hb/hb1.jpg" />
      </van-swipe-item>
    </van-swipe>
    <van-notice-bar left-icon="volume-o" :scrollable="false">
      <van-swipe vertical class="notice-swipe" :autoplay="3500" :show-indicators="false">
        <van-swipe-item v-for="(value, index) in notices" :key="index">{{value}}</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <van-grid :column-num="3">
      <van-grid-item v-for="item in list" :key="item.id" :icon="item.icon" :text="item.resourceName" :to="item.requestPath" />
    </van-grid>
  </div>
</template>

<script>
import NavTopBar from "../../commons/NavTopBar";
import { findUserFunctionReq, findMessageReq } from '../../../utils/api'

export default {
  name: "Home",
  components: {
    NavTopBar,
  },
  data() {
    return {
      searchvalue: "",
      list: [],
      notices: [],
      messageQuery: {

      }
    }
  },
  created() {
    this.findUserFunction() // 加载首页图标数据
    this.findMessage() // 查询首页通知
  },
  methods: {
    findMessage() {
      findMessageReq().then(res => {
        if (res.code == 200) {
          if (res.data.list.length > 0) {
            res.data.list.forEach((value, index) => {
              let message = (index + 1) + '. 《' + value.subject + "》 " + value.content.substr(0, 15)
              this.notices.push(message)
            })
          }
        } else {
          this.$toast(res.message)
        }
      })
    },
    onSearch() {

    },
    findUserFunction() { // 加载首页图标数据
      findUserFunctionReq({}).then(res => {
        if (res.code == 200) {
          this.list = res.data
        } else {
          this.$toast("加载菜单异常")
        }
      })
    }
  }
};
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>