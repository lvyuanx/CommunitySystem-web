<template>
  <div style="width: 100%; height:100%">
    <!-- 顶栏 Start -->
    <van-sticky :offset-top="0">
      <van-nav-bar :title="navBar.title" :left-text="navBar.leftText" :leftArrow="navBar.leftArrow" @click-left="onClickLeft" @click-right="onClickRight">
        <template #right>
          <van-icon :name="navBar.icon" size="18" />
        </template>
      </van-nav-bar>
    </van-sticky>
    <!-- 顶栏 End -->
    <!-- 个人资料展示 Start -->
    <van-row type="flex" justify="center" class="pt-5">
      <van-col span="6">
        <van-image round :src="userInfo.avatar" />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="6">
        <p class="mb-0 text-center">
          <strong>{{ userInfo.nickName == '' ? '暂无用户名' : userInfo.nickName }}</strong> <br />
          <small><span class="text-secondary">{{ userInfo.duties }}</span></small>
        </p>
      </van-col>
    </van-row>

    <van-cell-group title="健康">
      <van-cell title="健康码" is-link to="qrCode" />
    </van-cell-group>

    <van-cell-group title="个人">
      <van-cell title="个人详情" is-link to="userInfo" />
      <van-cell title="信息修改" is-link to="updateUserInfo" />
      <van-cell title="密码修改" is-link to="updatePassword" />
    </van-cell-group>

    <van-cell-group title="社区">
      <van-cell title="社区消息" is-link to="messageList" />
      <van-cell title="提交记录" is-link to="submitRecord" />
    </van-cell-group>
  </div>
</template>

<script>
import { loginInfoReq, getImageReq } from "../../../utils/api";
export default {
  name: "Center",
  data() {
    return {
      navBar: {
        title: "个人中心",
        leftText: "",
        leftArrow: false,
        icon: "setting-o",
      },
      userInfo: {
        nickName: "",
        duties: "",
        avatar: "/img/default/defaultHead.png",
      },
    };
  },
  created() {
    let _this = this;
    loginInfoReq().then((req) => {
      console.log(req);
      _this.userInfo.nickName = req.data.nickName;
      _this.userInfo.duties = req.data.duties;
      let avatar;
      if (req.data.avatar != null && req.data.avatar.trim() != '') {
        avatar = req.data.avatar;
        let _t = _this;
        getImageReq(
          {
            path: avatar,
          },
          {}
        ).then((r) => {
          _t.userInfo.avatar = window.URL.createObjectURL(r);
        });
      } else {
        this.userInfo.avatar = "/img/default/defaultHead.png"
      }

    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    onClickRight() {
      this.$router.push({ name: "setting" });
    },
  },
};
</script>

<style scoped>
.nav-top {
  position: sticky;
  width: 100%;
  left: 0px;
  z-index: 9999;
  top: 0px;
}
</style>