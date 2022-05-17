<template>
  <div style="width: 100%">
    <NavTopBar  title="密码修改" :leftArrow="true" :rightArrow="true"/>
      <van-form validate-first @failed="onFailed" @submit="onSubmit">
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
          v-model="oldPassword"
          type="password"
          name="pattern"
          label="原始密码"
          placeholder="请输入原始密码"
          :rules="[
            { pattern, message: '请输入6~8位包含大小写字母数字特殊字符！' },
          ]"
        />
        <!-- 通过 pattern 进行正则校验 -->
        <van-field
          v-model="newPassword"
          type="password"
          name="pattern"
          label="新密码"
          placeholder="请输入新密码"
          :rules="[
            { pattern, message: '请输入6~8位包含大小写字母数字特殊字符！' },
          ]"
        />
        <!-- 通过 validator 进行异步函数校验 -->
        <van-field
          v-model="repeatPassword"
          type="password"
          name="validator"
          label="重复新密码"
          placeholder="请重复输入新密码"
          :rules="[{ validator, message: '两次输入的密码不一致！' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="info" native-type="submit"
            >提交</van-button
          >
        </div>
      </van-form>
  </div>
</template>

<script>
import { updatePasswordReq, logoutReq } from "../../../../utils/api";
import NavTopBar from '../../../commons/NavTopBar'

export default {
  name: "UpdatePassword",
  components:{
    NavTopBar
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatPassword: "",
      pattern:
        /^.*(?=.{6,8})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/,
    };
  },
  methods: {
    /**返回 */
    onClickLeft() {
      this.$router.replace({ name: "center" });
    },
    /**回到主页 */
    onClickRight() {
      this.$router.replace({ name: "home" });
    },
    // 校验函数返回 true 表示校验通过，false 表示不通过
    validator() {
      return this.newPassword === this.repeatPassword;
    },
    onFailed(errorInfo) {
      this.$toast({
        message: "验证不通过，请注意错误提示",
        position: "bottom",
      });
    },
    onSubmit() {
      let _this = this;
      updatePasswordReq(
        {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
          repeatPassword: this.repeatPassword,
        },
        {}
      ).then((res) => {
        if (res.code == 200) {
          this.$dialog
            .alert({
              message: "密码修改成功，请重新登录",
            })
            .then(() => {
              logoutReq().then((req) => {
                if (req.code == 200) {
                  this.$toast.success(req.message);
                  this.$router.replace({ path: "/" });
                  this.removeLStore("rememberInfo")
                } else {
                  this.$toast.fail(req.message);
                }
              });
            });
        } else {
          _this.$toast.fail(res.message);
        }
        _this.oldPassword = "";
        _this.newPassword = "";
        _this.repeatPassword = "";
      });
    },
  },
};
</script>

<style>
</style>