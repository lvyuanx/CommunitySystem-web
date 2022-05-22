<template>
  <div class="row p-1">
    <div class="col-2">
      <nav-top-bar title="用户注册" :leftArrow="true" :rightArrow="false" />
    </div>

    <!--登录表单START-->
    <div class="col-sm-12 mt-2">
      <form action="#" class="row">
        <div class="form-group col-sm-12">
          <label for="loginName"><strong class="text-danger">*</strong>登录名:<small class="text-danger">{{errorMsg.loginNameTip}}</small></label>
          <input type="text" id="loginName" class="form-control" v-model="registerData.loginName" @change="checkloginName" />
        </div>
        <div class="form-group col-sm-12">
          <label for="nickName"><strong class="text-danger">*</strong>昵称:<small class="text-danger">{{errorMsg.nickNameTip}}</small></label>
          <input type="text" id="nickName" class="form-control" v-model="registerData.nickName" @change="checkNickName" />
        </div>
        <div class="form-group col-sm-12">
          <label for="realName"><strong class="text-danger">*</strong>真实姓名:<small class="text-danger">{{errorMsg.realNameTip}}</small></label>
          <input type="text" id="realName" class="form-control" v-model="registerData.realName" @change="checkRealName" />
        </div>
        <div class="form-group col-sm-12">
          <label for="password"><strong class="text-danger">*</strong>密码:<small class="text-danger">{{errorMsg.passwordTip}}</small></label>
          <input type="password" id="password" class="form-control" v-model="registerData.password" @change="checkPassword" />
        </div>
        <div class="form-group col-sm-12">
          <label for="confirmPassword"><strong class="text-danger">*</strong>确认密码:<small class="text-danger">{{errorMsg.confirmPasswordTip}}</small></label>
          <input type="password" id="confirmPassword" class="form-control" v-model="registerData.confirmPassword" @change="checkConfirmPassword" />
        </div>
        <div class="form-group col-sm-12">
          <van-radio-group v-model="registerData.sex" direction="horizontal">
            <van-radio :name="1">男</van-radio>
            <van-radio :name="0">女</van-radio>
          </van-radio-group>
        </div>
        <div class="form-group col-sm-12">
          <label for="mobil"><strong class="text-danger">*</strong>手机号码:<small class="text-danger">{{errorMsg.mobilTip}}</small></label>
          <input type="number" id="mobil" class="form-control" v-model="registerData.mobil" @change="checkMobil" />
        </div>
        <div class="form-group col-sm-12">
          <label for="tel">固定电话:<small class="text-danger">{{errorMsg.telTip}}</small></label>
          <input type="text" id="tel" class="form-control" v-model="registerData.tel" @change="checkTel" />
        </div>
        <div class="form-group col-sm-12">
          <label for="tel">电子邮箱:<small class="text-danger">{{errorMsg.emailTip}}</small></label>
          <input type="email" id="email" class="form-control" v-model="registerData.email" @change="checkEmail" />
        </div>
        <div class="form-group col-6">
          <label for="captcha"><strong class="text-danger">*</strong>验证码:<small class="text-danger">{{errorMsg.capthcaTip}}</small></label>
          <input type="text" id="captcha" class="form-control" v-model="registerData.captcha" @change="checkCaptcha" />
          <small id="captchaTip" class="form-text text-muted">点击图片刷新验证码！</small>
        </div>
        <div class="from-group col-6">
          <img class="img-fluid border rounded-lg" :src="captchaImg" alt="验证码" @click="initCaptcha" />
        </div>
        <div class="form-group col-sm-12 mt-4">
          <button type="button" class="btn btn-info mt-2 btn-block" @click="register">
            注册
          </button>
        </div>
      </form>
    </div>
    <!--登录表单END-->

    <div class="col-12"></div>
  </div>
</template>

<script>
import { captchaReq, isRepeatReq, registerReq } from '../../utils/api'
import NavTopBar from '../commons/NavTopBar.vue'

export default {
  name: "RegisterTable",
  components: { NavTopBar },
  data() {
    return {
      captchaImg: "",
      registerData: {
        loginName: '',
        password: '',
        confirmPassword: '',
        sex: 1,
        mobil: '',
        tel: '',
        email: '',
        captcha: '',
        realName: '',
        purpose: 'register_captcha',
        captchaId: '',
        nickName: '',
      },
      errorMsg: {
        loginNameTip: '',
        passwordTip: '',
        confirmPasswordTip: '',
        sexTip: 1,
        mobilTip: '',
        realNameTip: '',
        telTip: '',
        emailTip: '',
        nickNameTip: '',
        capthcaTip: ''
      }
    };
  },
  mounted() {
    // 初始化验证码
    this.initCaptcha()
  },
  methods: {
    // 初始化验证码
    initCaptcha() {
      let captchaId = this.getStore('register_captcha_id')
      if (this.getStore('register_captcha_id') == null) {
        captchaId = this.$uuid.v1()
        this.setStore('register_captcha_id', captchaId)
      }
      captchaReq({
        purpose: 'register_captcha',
        id: captchaId,
        v: Math.random()
      }, {}).then(res => {
        this.captchaImg = window.URL.createObjectURL(res)
      })
    },
    // 返回上一页
    toPreviousPage() {
      this.$router.go(-1);
    },
    // 表单检查start
    checkloginName() {
      // 用户名正则
      let uPattern = /^[a-zA-Z0-9_-]{4,8}$/
      let len = this.registerData.loginName.length
      if (!uPattern.test(this.registerData.loginName)) {
        this.errorMsg.loginNameTip = "用户名格式错误：4到8位（字母，数字，下划线，减号）！"
        this.registerData.loginName = ''
      } else {
        // 校验用户名唯一性
        this.isRepeat()
      }

    },
    checkPassword() {
      //密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
      let pPattern = /^.*(?=.{6,8})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/
      if (!pPattern.test(this.registerData.password)) {
        this.errorMsg.passwordTip = '请输入6~8位包含大小写字母数字特殊字符！';
        this.registerData.password = ''
      } else {
        this.errorMsg.passwordTip = ''
      }
    },
    checkConfirmPassword() {
      if (this.registerData.password != this.registerData.confirmPassword) {
        this.errorMsg.confirmPasswordTip = '两次输入的密码不一致！'
        this.registerData.confirmPassword = ''
      } else {
        this.errorMsg.confirmPasswordTip = ''
      }
    },
    checkTel() {
      let tPattern = /^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/
      if (!tPattern.test(this.registerData.tel)) {
        this.errorMsg.telTip = '电话号码格式不正确！'
        this.registerData.tel = ''
      } else {
        this.errorMsg.telTip = ''
      }
    },
    checkMobil() {
      let mPattern = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
      if (!mPattern.test(this.registerData.mobil)) {
        this.errorMsg.mobilTip = '手机号码格式不正确！'
        this.registerData.mobil = ''
      } else {
        this.errorMsg.mobilTip = ''
      }
    },
    checkEmail() {
      let ePattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (!ePattern.test(this.registerData.email)) {
        this.errorMsg.emailTip = '邮箱格式不正确！'
        this.registerData.email = ''
      } else {
        this.errorMsg.emailTip = ''
      }
    },
    checkNickName() {
      let nPattern = /^(?:[\u4e00-\u9fa5·A-Za-z0-9]{2,7})$/
      if (!nPattern.test(this.registerData.nickName)) {
        this.errorMsg.nickNameTip = '昵称格式不正确！(昵称格式：最长不得超过7个汉字，或14个字节(数字，字母))'
        this.registerData.nickName = ''
      } else {
        this.errorMsg.nickNameTip = ''
      }
    },
    checkRealName() {
      let nPattern = /^(?:[\u4e00-\u9fa5·A-Za-z0-9]{2,7})$/
      if (!nPattern.test(this.registerData.realName)) {
        this.errorMsg.realNameTip = '姓名格式不正确！'
        this.registerData.realName = ''
      } else {
        this.errorMsg.realNameTip = ''
      }
    },
    checkCaptcha() {
      let cPattern = /^[A-Za-z0-9]+$/
      if (!cPattern.test(this.registerData.captcha)) {
        this.errorMsg.capthcaTip = '验证码不正确'
        this.registerData.captcha = ''
      } else {
        this.errorMsg.capthcaTip = ''
      }
    },
    // 表单检查end
    /**用户名重复判断 */
    isRepeat() {
      let _this = this;
      let reqData = {
        loginName: this.registerData.loginName
      }
      isRepeatReq({}, reqData).then(res => {
        if (res.message == '重复!') {
          _this.errorMsg.loginNameTip = '用户名重复!'
          _this.registerData.loginName = ''
        } else if (res.message == '未重复!') {
          _this.errorMsg.loginNameTip = ''
        }
      })
    },
    /**用户注册 */
    register() {
      // 由于已经做了格式校验，所有只需要判空即可
      let flag = this.judgment()
      if (!flag) {
        // 结束方法
        return
      }
      let _this = this
      this.registerData.captchaId = this.getStore('register_captcha_id')
      registerReq({}, this.registerData).then(res => {
        _this.initCaptcha()
        if (res.code === 200) {
          _this.$toast.success(res.message)
          this.$router.go(-1);
        } else {
          _this.$toast.fail(res.message)
        }
      })
    },
    /**判空 */
    judgment() {
      let data = this.registerData
      let msg = this.errorMsg
      let flag = true
      if (data.loginName.trim() === '') {
        msg.loginNameTip = '用户名不能为空！'
        flag = false
      }
      if (data.realName.trim() === '') {
        msg.realNameTip = '真实姓名不能为空！'
        flag = false
      }
      if (data.password.trim() === '') {
        msg.passwordTip = '密码不能为空！'
        flag = false
      }
      if (data.nickName.trim() === '') {
        msg.nickNameTip = '昵称不能为空！'
        flag = false
      }
      if (data.confirmPassword.trim() === '') {
        msg.confirmPasswordTip = '确认密码不能为空！'
        flag = false
      }
      if (data.mobil.trim() === '') {
        msg.mobilTip = '手机号码不能为空！'
        flag = false
      }
      if (data.captcha.trim() === '') {
        msg.capthcaTip = '验证码不能为空！'
        flag = false
      }
      return flag;
    }
  },
};
</script>

<style>
</style>