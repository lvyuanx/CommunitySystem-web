<template>
  <div class="row pb-3 pt-3">
    <!--标题START-->
    <div class="col-sm-12 mt-5 mb-5">
      <h3 class="text-center"><strong>社区健康疫情管理系统</strong></h3>
    </div>
    <!--标题END-->
    <!--登录表单START-->
    <div class="col-sm-12">
      <form action="#" class="row">
        <div class="form-group col-sm-12">
          <label for="username">用户名:</label>
          <input type="text" id="username" class="form-control" v-model="loginData.username" />
        </div>
        <div class="form-group col-sm-12">
          <label for="password">密码:</label>
          <input type="password" id="password" class="form-control" @click="changeData" v-model="loginData.password" />
        </div>
        <div class="form-group col-6">
          <label for="captcha">验证码:</label>
          <input type="text" id="captcha" v-model="loginData.captcha" class="form-control" />
          <small id="captchaTip" class="form-text text-muted">点击图片刷新验证码！</small>
        </div>
        <div class="from-group col-6">
          <img :src="captchaImg" @click="initCaptcha" class="img-fluid border rounded-lg" alt="验证码" />
        </div>
        <!-- <div class="form-group col-12">
          <label class="checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              v-model="rememberMe"
            /> 记住我
          </label>
        </div> -->
        <div class="form-group col-12">
          记住我 <br />
          <van-switch v-model="rememberMe" size="20" />
        </div>
        <div class="form-group col-sm-12 mt-4">
          <button type="button" class="btn btn-success btn-block" @click="login">
            登录
          </button>
          <button type="button" class="btn btn-info mt-2 btn-block" @click="toRegister">
            注册
          </button>
        </div>
      </form>
    </div>
    <!--登录表单END-->

    <!--消息弹窗START-->
    <div class="position-fixed bottom-0 right-0 p-3" style="z-index: 5; right: 0; bottom: 0">
      <div id="liveToast" class="toast hiden" role="alert" aria-live="assertive" aria-atomic="true" data-delay="2000">
        <div class="toast-header">
          <img :src="msgLog" class="rounded mr-2" alt="弹窗" />
          <strong class="mr-auto">系统消息</strong>
          <small></small>
          <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="toast-body">
          {{ loginMsg }}
        </div>
      </div>
    </div>
    <!--消息弹窗END-->

    <!--房间选择START-->
    <van-popup v-model="show" round position="bottom">
      <van-cascader v-model="cascaderValue" title="请选择家庭住址" :options="options" @close="show = false" @finish="onFinish" />
    </van-popup>
    <!--房间选择END-->
  </div>
</template>

<script>
import {
  loginReq,
  captchaReq,
  findAllCommunityInfoReq,
  bindRoleAndHouseholdReq,
  findInfoByUserReq,
  logoutReq
} from "../../utils/api";
export default {
  name: "LoginTable",
  data() {
    return {
      captchaImg: "",
      msgLog: "/img/log/msgLog.png",
      loginMsg: "登录失败,请重新登录！",
      loginData: {
        username: "admin", // 方便测试，默认填充用户名密码
        password: "Lv@12345",
        captcha: "0715",
        captchaId: "",
        rememberFlag: false,
      },
      rememberMe: true,
      show: false,
      fieldValue: "",
      cascaderValue: "",
      // 选项列表，children 代表子选项，支持多级嵌套
      options: [],
    };
  },
  mounted() {
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
    // 初始化验证码
    this.initCaptcha();
  },
  methods: {
    // 初始化验证码
    initCaptcha() {
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
        // this.setStore('login_captcha_id', )
      });
    },
    /*登录方法*/
    login() {
      let _this = this;
      this.loginData.captchaId = this.getStore("login_captcha_id");
      loginReq({}, this.loginData).then((res) => {
        _this.initCaptcha();
        if (res.code != 200) {
          _this.loginData.captcha = "";
          if (res.message != "验证码错误！") {
            _this.loginData.username = "";
            _this.loginData.password = "";
          }
          if (res.message != null) {
            _this.$toast.fail(res.message);
          }
        } else {
          console.log(res.data)
          // 请求成功,将token信息存储到本地（session中）
          _this.setStore("L-Token", res.data.token);
          // 如果选择记住我保存到（local中）
          if (_this.rememberMe) {
            let rememberInfo = {
              username: res.data.shiroUser.loginName,
              password: res.data.shiroUser.password,
              rememberMe: true,
              timeoutTime: Date.now() + 1000 * 60 * 60 * 24 * 15, // 超时时间
            };
            let oldRememberInfo = _this.getLStore("rememberInfo");
            if (
              oldRememberInfo != null &&
              oldRememberInfo.username == rememberInfo.username
            ) {
              // 如果当前用户之前点击过记住我,则使用上一次的时间
              rememberInfo.timeoutTime = oldRememberInfo.timeoutTime;
            }
            _this.setLStore("rememberInfo", rememberInfo);
          } else {
            // 清除记住我的消息
            _this.removeLStore("rememberInfo");
          }
          // 判断身份信息
          if (res.data.shiroUser.isEnable === 0) {
            // 身份信息未激活
            findInfoByUserReq().then(r => {
              if (r.code === 200) {
                // 判断是否有绑定房价信息
                if (r.data !== null) {
                  // 退出登录状态
                  this.logout()
                  this.$toast("请耐心等待管理员审批身份信息")
                } else {
                  findAllCommunityInfoReq().then((r2) => {
                    this.$toast({
                      message: '请先完善住址信息，或者等待管理员操作',
                      position: 'top',
                    });
                    _this.show = true;
                    _this.options = r2.data;
                  });
                }
              } else {
                this.$toast.fail(r.message)
              }
            })
          } else {
            // 讲用户信息缓存到sessionStorage中
            let userSession = {
              userName: res.data.shiroUser.realName,
              userId: res.data.shiroUser.id,
              roleName: res.data.shiroUser.roleName,
              token: res.data.token
            }
            this.setStore("userSession", userSession)
            _this.$toast.success(res.message);
            // 跳转到首页
            _this.$router.replace({
              path: `/home`,
            });
          }
        }
      });
    },
    // 校验是否为空
    checkTable() {
      if (
        this.loginData.username.trim() == "" ||
        this.loginData.password == "" ||
        this.loginData.capthca == ""
      ) {
        $(".toast").toast("show");
        this.loginMsg("登录信息不能为空！");
      }
    },
    // 退出登录
    logout() {
      logoutReq().then(res => {
        console.log("退出登录成功");
      })
    },
    // 点击密码输入框，自动填充的密码情空
    changeData() {
      if (this.loginData.rememberFlag) {
        this.loginData.rememberFlag = false;
        this.loginData.password = "";
      }
    },
    // 跳转到注册组件
    toRegister() {
      this.$router.push({
        path: `/register`,
      });
    },
    // 全部选项选择完毕后，会触发 finish 事件
    onFinish({ selectedOptions }) {
      this.show = false;
      let selId = selectedOptions[selectedOptions.length - 1].value
      this.fieldValue = selectedOptions.map((option) => option.text).join("/");
      this.$dialog.confirm({
        title: "选择完成",
        message: "是否确定绑定：" + this.fieldValue,
      })
        .then(() => {
          this.bind(selId)
        })
        .catch(() => {
          // on cancel
        });
    },
    bind(householdId) {
      bindRoleAndHouseholdReq({ householdId: householdId }).then(res => {
        if (res.code === 200) {
          this.$toast.success("绑定成功，请等待管理员审核")
        } else {
          this.$toast.fail(res.message)
        }
      })
    }
  },
};
</script>

<style scoped>
</style>