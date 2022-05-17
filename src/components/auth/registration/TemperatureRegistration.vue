<template>
  <div style="width: 100%">
    <nav-top-bar title="健康打卡" :leftArrow="true" :rightArrow="true" />

    <van-form @submit="onSubmit">
      <van-field v-model="CommunityTemperatureRegistration.temperature" name="体温" label="体温" placeholder="请输入当前体温" :rules="[{ required: true, message: '当前体温不能为空' }]" />
      <van-field v-model="CommunityTemperatureRegistration.registrationPlace" name="登记地点" label="登记地点" placeholder="请输入当登记地点" :rules="[{ required: true, message: '当前登记地点不能为空' }]" />
      <van-field name="switch" label="进入高风险区">
        <template #input>
          <van-switch v-model="switchCheckedIsToHighRisk" size="20" style="margin-left:10px" /> <span style="color:#c8c9cc">14天内到访高风险地区</span>
        </template>
      </van-field>

      <van-field v-if="switchCheckedIsToHighRisk" v-model="CommunityTemperatureRegistration.toHighRiskAddress" name="高风险地区" label="高风险地区" placeholder="高风险地区" :rules="[{ required: true, message: '高风险地区不能为空' }]" />
      <van-field disabled v-model="CommunityTemperatureRegistration.continuous" name="健康打卡天数" label="健康打卡天数" />
      <van-field disabled v-model="CommunityTemperatureRegistration.createTime" name="打卡时间" label="打卡时间" />
      <div style="margin: 16px">
        <van-button round :disabled="onSubmitDisabled" block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import NavTopBar from "../../commons/NavTopBar";
import { CTRAddReq, continuousDayReq } from "../../../utils/api"
export default {
  name: "TemperatureRegistration",
  components: {
    NavTopBar,
  },
  data() {
    return {
      CommunityTemperatureRegistration: {
        temperature: null,
        registrationPlace: "",
        isToHighRisk: 0,
        toHighRiskAddress: "",
        continuous: 0,
        createTime: "",
      },
      switchCheckedIsToHighRisk: false,
      onSubmitDisabled: false
    };
  },
  computed: {
    isChecked() {
      this.switchCheckedIsToHighRisk
        ? (this.CommunityTemperatureRegistration.isToHighRisk = 1)
        : (this.CommunityTemperatureRegistration.isToHighRisk = 0);
    },
  },
  mounted() {
    // 查询连续登陆日期
    this.continuousDay();
    //显示当前日期时间
    let _this = this; // 声明一个变量指向Vue实例this，保证作用域一致
    this.timer = setInterval(() => {
      _this.CommunityTemperatureRegistration.createTime = _this.dateFormat(new Date()); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    onSubmit() {
      if (this.CommunityTemperatureRegistration.temperature >= 37.5) {
        this.$dialog.confirm({
          title: '高温预警',
          message: '你的体温异常，是否继续提交',
        })
          .then(() => {
            this.uploadForm();
          })
          .catch(() => {
            // on cancel
          });
      } else {
        this.uploadForm();
      }
    },
    uploadForm() {
      CTRAddReq({}, this.CommunityTemperatureRegistration).then(res => {
        if (res.code == 200) {
          this.$toast.success("打卡成功")
          // // 清空数据
          // this.CommunityTemperatureRegistration = {
          //   temperature: null,
          //   registrationPlace: "",
          //   isToHighRisk: 0,
          //   toHighRiskAddress: "",
          //   continuous: 0,
          //   createTime: "",
          // }
          this.onSubmitDisabled = true
          this.continuousDay();
        } else {
          this.$toast.fail("打卡失败")
        }
      })
    },
    dateFormat(time) {
      var date = new Date(time);
      var year = date.getFullYear();
      /* 在日期格式中，月份是从0开始的，因此要加0
       * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
       * */
      var month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      var hours =
        date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      var minutes =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      var seconds =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      // 拼接
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    },
    continuousDay() {
      continuousDayReq().then(res => {
        if (res.code === 200) {
          this.CommunityTemperatureRegistration.continuous = res.data
        } else {
          this.$toast("查询连续打卡天数失败");
        }
      })
    }
  },
};
</script>

<style>
</style>