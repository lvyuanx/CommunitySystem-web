<template>
  <div style="width:100%" class="qrBox">
    <NavTopBar title="个人健康码" :leftArrow="true" :rightArrow="true" />

    <van-row type="flex" justify="center">
      <van-col span="22" class="userInfoBox ">
        <van-row type="flex" justify="center" class="infoBox">
          <van-col span="8">
            <van-icon name="manager" size="20" color="#1989fa" /> 姓名
          </van-col>
          <van-col span="16">
            <van-icon name="phone-circle" size="20" color="#1989fa" /> 联系方式
          </van-col>
          <van-col span="8">
            {{codeInfo.userName}}
          </van-col>
          <van-col span="16">
            {{codeInfo.mobile}}
          </van-col>
        </van-row>
      </van-col>
    </van-row>

    <van-row type="flex" justify="center">
      <van-col span="22" class="qrImgBox">
        <p class="margin:5px">
          {{nowTime}}
        </p>

        <img class="qrCodeImage" :style="qrDynamicStyle" :src="qrCodeUrl" />
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="22">
        <van-row type="flex" justify="space-between">
          <van-col span="11" class="userInfoBox" :style="dayBoxStyle">
            <strong>健康打卡天数：</strong>
            <p>{{day}} 天</p>
          </van-col>
          <van-col span="11" class="userInfoBox">
            <strong>健康码类型：</strong>
            <p>
              {{codeInfo.codeTypeName}}
              <van-icon :name="icon" size="18" :color="iconColor" /> <br>
            </p>
          </van-col>
        </van-row>
      </van-col>
    </van-row>
  </div>
</template>

<script>
import NavTopBar from '../../../commons/NavTopBar'
import { qrCodeGetByUserReq, qrCodeGetInfoByUserReq, continuousDayReq } from "../../../../utils/api"
export default {
  name: 'QrCode',
  components: {
    NavTopBar
  },
  data() {
    return {
      day: 0,
      qrCodeUrl: '',
      icon: 'checked',
      iconColor: "green",
      nowTime: '2000-07-15 00:00:00',
      qrDynamicStyle: {
        border: "1px solid red"
      },
      dayBoxStyle: {
        backgroundColor: "Thistle",
        color: "white"
      },
      codeInfo: {
        id: '',
        codeType: '',
        codeTypeName: 'xxx',
        userId: '',
        userName: 'xxx',
        mobile: 'xxxx'
      }
    }
  },
  created() {
    this.continuousDay()
    this.qrCodeGetByUser()
    this.handlGetQrCodeInfoByUser()
    this.timer = setInterval(() => {
      this.nowTime = this.dateFormat(new Date()); // 修改数据date
    }, 1000);
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer); // 在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
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
            switch (this.codeInfo.codeType) {
              case "red":
                this.icon = 'clear'
                this.iconColor = 'red'
                this.qrDynamicStyle.border = "5px groove #e74033"
                break;
              case "yellow":
                this.icon = 'warning'
                this.iconColor = 'yellow'
                this.qrDynamicStyle.border = "5px groove #fcc72d"
                break;
              case "gray":
                this.icon = 'more'
                this.iconColor = 'gray'
                this.qrDynamicStyle.border = "5px groove #e2e3e5"
                break;
              case "green":
                this.icon = 'checked'
                this.iconColor = 'green'
                this.qrDynamicStyle.border = "5px groove #00a94e"
                break;
              default:
                this.$router.go(-1)
                this.$toast.fail("健康码类型错误")
                break;
            }
          }
        } else {
          this.$toast("查询健康码信息异常")
          // 返回上一级
          this.$router.go(-1)
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
    continuousDay() { // 查询连续打卡天数
      continuousDayReq().then(res => {
        if (res.code == 200) {
          this.day = res.data
          if (this.day > 7) {
            this.dayBoxStyle.backgroundColor = '#208c44'
          } else {
            this.dayBoxStyle.backgroundColor = '#fcc72d'
          }
        } else {
          this.$toast("查询连续打卡天数失败")
        }
      })
    }
  }
}
</script>

<style scopec>
.qrCodeImage {
  margin: 0 auto;
  width: 70%;
}
.infoBox {
  margin-top: 10px;
}
.userInfoBox {
  margin-top: 8px;
  margin-bottom: 8px;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  background-color: white;
  box-shadow: #ccc 0px 0px 5px;
  border-radius: 5px;
}
.userInfoBox > p {
  margin: 0;
}
.qrImgBox {
  background-color: white;
  box-shadow: #ccc 0px 0px 5px;
  padding: 20px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
}
</style>