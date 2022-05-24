<template>
  <div class="box loginBox">
    <div style="height:30px"></div>
    <div class="logo">
    </div>
    <!-- 标题-START -->
    <h3 class="titleBox"><strong>社区健康疫情管理系统</strong></h3>
    <!-- 标题-START -->
    <!-- 登录表单-START -->
    <van-row type="flex" justify="center">
      <van-col span="20">
        <div class="input_control mb">
          <span class="userNameIcon"></span>
          <input type="text" v-model="loginData.username" name="username" id="username" placeholder="请输入用户名">
        </div>
      </van-col>
      <van-col span="20">
        <div class="input_control" style="margin-bottom:0px">
          <span class="passwordIcon"></span>
          <input type="password" @click="changeData" v-model="loginData.password" name="password" id="password" placeholder="请输入密码">
          <p class="tips"><a href="javascript:void(0)" @click="tips">忘记密码？</a></p>
        </div>

      </van-col>
      <van-col span="9">
        <van-row>
          <div class="input_control mb">
            <span class="captchaIcon"></span>
            <input type="text" v-model="loginData.captcha" name="captcha" id="captcha" placeholder="请输入验证码">
          </div>
        </van-row>
        <van-row style="padding-left:3px">
          <van-checkbox v-model="rememberMe" class="rembBox">记住我</van-checkbox>
        </van-row>
      </van-col>
      <van-col span="1"></van-col>
      <van-col span="10">
        <img :src="captchaImg" @click="initCaptcha" class="captchaImg" alt="验证码" />
      </van-col>
    </van-row>
    <!-- 登录表单-END -->
    <!-- 滑动输入-START -->
    <sild-to-un-lock :username="loginData.username" :password="loginData.password" :key="nowTimer" @actionLogin="actionLogin" />
    <!-- 滑动输入-END -->
    <p class="toRegister" v-show="isShowBottom">还没有账号？<a href="javascript:void(0)" @click="toRegister">去注册</a></p>
    <!--房间选择START-->
    <select-address :isShow="isShowSelectAddress" :userId="loginUserId" />
    <!--房间选择END-->
  </div>

</template>

<script>
import SildToUnLock from '../commons/SildToUnLock.vue';
import SelectAddress from '../commons/address/index.vue'
import {
  loginReq,
  captchaReq,
  updateHouseholdUserReq,
  findInfoByUserReq,
  checkUserHasAddressReq,
  logoutReq
} from "../../utils/api";
export default {
  name: 'UserLogin',
  components: { SildToUnLock, SelectAddress },
  data() {
    return {
      isShowBottom: true,  //显示或者隐藏footer
      documentHeight: document.documentElement.clientHeight,  //默认屏幕高度
      show: false,
      captchaImg: '',
      loginUserId: '',
      isShowSelectAddress: false,
      rememberMe: true,
      loginData: {
        username: "admin",
        password: "Lv@12345",
        captcha: "7515",
        captchaId: "",
        nowTimer: '',
        rememberFlag: false,
      }
    }
  },
  created() {
    this.nowTimer = new Date().getTime();
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        if (this.documentHeight > document.documentElement.clientHeight) {
          this.isShowBottom = false
        } else {
          this.isShowBottom = true
        }
      })()
    }

    this.initCaptcha() // 初始化验证码
    // 判断之前登录是否选择记住我
    let rememberInfo = JSON.parse(localStorage.getItem("rememberInfo"));
    if (rememberInfo != null) {
      // 判断是否超时
      if (rememberInfo.timeoutTime < Date.now()) {
        // 超时删除
        this.removeStore("rememberInfo");
      } else {
        this.loginData.username = rememberInfo.username;
        this.loginData.password = rememberInfo.password;
        this.rememberMe = rememberInfo.rememberMe;
        this.loginData.rememberFlag = true;
      }
    }
    this.$bus.$on("changeShow", (isShow) => {
      this.isShowSelectAddress = isShow
    })

    this.$bus.$on("changeAddress", (params) => {
      let { selectedOptions, userId, householdId } = params
      // 修改用户户关联关系
      this.updateHouseholdUser(userId, householdId);
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeShow")
    this.$bus.$off("changeAddress")
  },
  methods: {
    // 点击密码输入框，自动填充的密码情空
    changeData() {
      if (this.loginData.rememberFlag) {
        this.loginData.rememberFlag = false;
        this.loginData.password = "";
      }
    },
    actionLogin() { // 登录
      if (this.loginData.username.trim() == '' || this.loginData.password.trim() == '' || this.loginData.captcha.trim() == '') {
        this.$toast("登录信息不能为空")
        this.nowTimer = new Date().getTime();
        this.$bus.$emit("loginError")
      } else {
        this.login()
      }

    },
    tips() { // 忘记密码
      this.$toast("请联系社区管理员重置密码")
    },
    toRegister() { // 去往登录界面
      this.$router.push({ name: "register" });
    },
    initCaptcha() { // 初始化验证码
      let captchaId = this.getStore("login_captcha_id");
      if (this.getStore("login_captcha_id") == null) {
        captchaId = this.$uuid.v1();
        this.setStore("login_captcha_id", captchaId);
      }
      captchaReq(
        {
          purpose: "login_captcha",
          id: captchaId,
          v: Math.random(),
        },
        {}
      ).then((res) => {
        this.captchaImg = window.URL.createObjectURL(res);
      });
    },
    login() { // 登录
      this.loginData.captchaId = this.getStore("login_captcha_id");
      loginReq({}, this.loginData).then(res => {
        this.initCaptcha();
        if (res.code == 200) {
          // 请求成功,将token信息存储到本地（session中）
          this.setStore("L-Token", res.data.token);
          // 校验登录身份
          this.loginUserId = res.data.shiroUser.id
          this.checkLoginRole(res)
          // this.$router.replace({ name: 'home' })
        } else {
          this.$toast.fail(res.message)
          this.$bus.$emit("loginError")
        }
      })
    },
    logout() { // 退出登录
      logoutReq().then(res => {
        console.log("退出登录成功");
      })
    },
    checkLoginRole(res) {
      // 身份信息未激活
      checkUserHasAddressReq().then(r => {
        if (r.code == 200) {
          // 判断是否有绑定房价信息
          if (r.data == 0) {
            // 退出登录状态
            this.logout()
            this.$toast("请耐心等待管理员审批身份信息")
            this.$bus.$emit("loginError")
          } else if (r.data == 2 && res.data.shiroUser.isEnable == 0) {
            this.$toast({
              message: '请先完善住址信息，或者等待管理员操作',
              position: 'top',
            });
            this.$bus.$emit("loginError")
            this.isShowSelectAddress = true // 显示选择房间信息窗口
          } else if (r.data == 1 || res.data.shiroUser.isEnable == 1) {
            // 将用户信息缓存到sessionStorage中
            let userSession = {
              userName: res.data.shiroUser.realName,
              userId: res.data.shiroUser.id,
              roleName: res.data.shiroUser.roleName,
              token: res.data.token
            }
            this.setStore("userSession", userSession)
            // 如果选择记住我保存到（local中）
            if (this.rememberMe) {
              let rememberInfo = {
                username: res.data.shiroUser.loginName,
                password: res.data.shiroUser.password,
                rememberMe: true,
                timeoutTime: Date.now() + 1000 * 60 * 60 * 24 * 15, // 超时时间
              };
              let oldRememberInfo = this.getLStore("rememberInfo");
              if (
                oldRememberInfo != null &&
                oldRememberInfo.username == rememberInfo.username
              ) {
                // 如果当前用户之前点击过记住我,则使用上一次的时间
                rememberInfo.timeoutTime = oldRememberInfo.timeoutTime;
              }
              this.setLStore("rememberInfo", rememberInfo);
            } else {
              // 清除记住我的消息
              this.removeLStore("rememberInfo");
            }
            this.$toast.success(res.message);
            // 跳转到首页
            this.$router.replace({
              path: `/home`,
            });
          }
        } else {
          this.$toast(r.message)
        }
      })
    },
    updateHouseholdUser(userId, householdId) { // 修改用户户关联关系
      let params = {
        userId: userId,
        householdId: householdId
      }
      updateHouseholdUserReq(params).then(res => {
        if (res.code == 200) {
          this.$toast.success("添加成功")
        } else {
          this.$toast.fail("添加失败")
        }
      })
    },
  }
}
</script>

<style scoped>
.titleBox {
  text-align: center;
  padding-bottom: 80px;
}

.loginBox {
  background-color: white;
}
input {
  width: 100%;
  -webkit-appearance: none;
  -moz-appearance: none;
  font-size: 0.8em;
  height: 42px;
  border-radius: 21px;
  border: 0px;
  outline: none;
  text-align: left;
  padding-left: 44px;
  background-color: #eee;
}
input:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}
.input_control {
  position: relative;
}
.input_control > span {
  position: absolute;
  display: inline-block;
  width: 42px;
  height: 42px;
  background-size: 80% 80%;
  background-position: center;
}
.userNameIcon {
  background: url(../../assets/img/default/username.png) no-repeat;
}
.passwordIcon {
  background: url(../../assets/img/default/password.png) no-repeat;
}
.captchaIcon {
  background: url(../../assets/img/default/captcha.png) no-repeat;
}
.tips {
  text-align: right;
  font-size: 10px;
  margin-bottom: 5px;
  margin-top: 3px;
}
.mb {
  margin-bottom: 18px;
}
.tips > a {
  color: #e06c75;
}
.logo {
  height: 100px;
  width: 100%;
  background: url(../../assets/img/default/logo.png) no-repeat;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
.toRegister {
  position: fixed;
  bottom: 0;
  text-align: center;
  width: 100%;
}
.toRegister > a {
  display: inline;
}
.captchaImg {
  border: 1px solid #eee;
  border-radius: 5px;
  max-width: 200px;
}
</style>