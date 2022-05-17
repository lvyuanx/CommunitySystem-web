<template>
  <div style="width: 100%">
    <nav-top-bar title="出入登记" :leftArrow="true" :rightArrow="true" />

    <van-form @submit="onSubmit">
      <van-field name="健康码" label="健康码">
        <template #input>
          <img class="qrCodeImage" :src="qrCodeUrl" />
        </template>
      </van-field>
      <van-field name="switch" label="进入或离开">
        <template #input>
          <van-switch v-model="switchCheckedInOrOut" size="20" style="margin-right: 10px" />
          {{ switchInOrOutLable }}
        </template>
      </van-field>

      <van-field name="switch" label="健康状况">
        <template #input>
          <van-switch v-model="switchCheckedIsHealth" size="20" :disabled="isHealthDisable" style="margin-right: 10px" />
          {{ switchIsHealthLable }}
        </template>
      </van-field>

      <van-field v-if="! switchCheckedIsHealth" v-model="communityInAndOut.abnormalBodyTemperature" name="异常体温" label="异常体温" placeholder="请输入异常体温" :rules="[{ required: true, message: '异常体温不能为空' }]" />

      <div style="margin: 16px">
        <van-button round :disabled="onSubmitDisabled" block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavTopBar from "../../commons/NavTopBar";
import { qrCodeGetByUserReq, inAndOutAddReq, qrCodeGetInfoByUserReq } from "../../../utils/api"
export default {
  name: "InAndOut",
  components: {
    NavTopBar,
  },
  data() {
    return {
      communityInAndOut: {
        inOrOut: 0,
        isHealth: 0,
        abnormalBodyTemperature: null
      },
      switchCheckedInOrOut: true,
      switchCheckedIsHealth: true,
      isHealthDisable: false,
      qrCodeUrl: "",
      codeInfo: {
        id: '',
        codeType: '',
        codeTypeName: '',
        userId: '',
        userName: ''
      },
      onSubmitDisabled: false,
    };
  },
  created() {
    this.qrCodeGetByUser()
    this.handlGetQrCodeInfoByUser()
  },
  computed: {
    switchInOrOutLable() {
      this.switchCheckedInOrOut
        ? (this.communityInAndOut.inOrOut = 0)
        : (this.communityInAndOut.inOrOut = 1);
      return this.switchCheckedInOrOut ? "进入社区" : "离开社区";
    },
    switchIsHealthLable() {
      this.switchCheckedIsHealth
        ? (this.communityInAndOut.isHealth = 0)
        : (this.communityInAndOut.isHealth = 1);
      return this.switchCheckedIsHealth ? "体温健康" : "体温异常";
    },
  },
  methods: {
    onSubmit() {
      inAndOutAddReq({}, this.communityInAndOut).then(res => {
        if (res.code == 200) {
          this.$toast.success(res.message)
          this.onSubmitDisabled = true;
        } else {
          this.$toast.fail(res.message)
        }
      })
    },
    // 得到用户健康码
    qrCodeGetByUser() {
      qrCodeGetByUserReq().then(res => {
        this.qrCodeUrl = window.URL.createObjectURL(res);
      })
    },
    handlGetQrCodeInfoByUser() {
      qrCodeGetInfoByUserReq().then(res => {
        if (res.code == 200) {
          if (res.data == null) {
            this.$toast("没有查询到健康码信息，请联系管理员")
            this.$router.go(-1)
          } else {
            this.codeInfo = res.data
            if (res.data.codeType != 'green') {
              this.switchCheckedIsHealth = false
              this.isHealthDisable = true
            }
          }
        } else {
          this.$toast("查询健康码信息异常")
          // 返回上一级
          this.$router.go(-1)
        }
      })
    }
  },
};
</script>

<style scoped>
.qrCodeImage {
  width: 70%;
  border: solid 3px #eee;
}
</style>