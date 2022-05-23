<template>
  <div class="box exceptionInfoBox">
    <van-swipe-cell class="box cellBox">
      <van-row class="rowBox">
        <van-col span="8 imageBox" :style="{'background-image': 'url(' + avatarUrl + ')'}">
        </van-col>
        <van-col span="16 infoBox">
          <van-row class="lineBox">
            <van-col span="10">
              <strong>姓名：</strong>{{userInfo.user.realName}}
            </van-col>
            <van-col span="14">
              <strong>电话：</strong>{{userInfo.user.mobil}}
            </van-col>
          </van-row>
          <van-row class="lineBox">
            <van-col span="10">
              <strong>健康码：</strong><span class="typeBox" :style="tabStyle">{{qrCodeInfo.codeTypeName == null ? "未知" : qrCodeInfo.codeTypeName}}</span>
            </van-col>
            <van-col span="14">
              <strong>连续健康打卡：</strong>{{day}}天
            </van-col>
          </van-row>
          <van-row class="lineBox">
            <van-col span="24">
              <van-divider :style="{ marginTop: '3px', marginBottom: '0px', color: '#1989fa', borderColor: '#1989fa' }">角色功能</van-divider>
            </van-col>
            <van-col span="24">
              <van-tag style="margin:3px" type="primary" v-for="item in userInfo.user.roleVoList" :key="item.id">{{item.roleName}}</van-tag>
            </van-col>
          </van-row>
        </van-col>
      </van-row>
      <template #left>
        <van-button square type="info" class="cell-button" @click="changeCode" text="转码" />
      </template>
      <template #right>
        <van-button square type="primary" class="cell-button" @click="resetPassword" text="重置" />
        <van-button square type="danger" class="cell-button" @click="deleteUser" text="删除" />
      </template>
    </van-swipe-cell>
    <select-address :isShow="showSelectAddress" :userId="selectUserId" />
    <van-dialog v-model="changeCodeBox" title="转码" showCancelButton @confirm='confirm'>
      <van-radio-group v-model="radio">
        <van-cell-group>
          <van-cell title="灰码" clickable @click="radio = 'gray'">
            <template #right-icon>
              <van-radio name="gray" />
            </template>
          </van-cell>
          <van-cell title="绿码" clickable @click="radio = 'green'">
            <template #right-icon>
              <van-radio name="green" />
            </template>
          </van-cell>
          <van-cell title="黄码" clickable @click="radio = 'yellow'">
            <template #right-icon>
              <van-radio name="yellow" />
            </template>
          </van-cell>
          <van-cell title="红码" clickable @click="radio = 'red'">
            <template #right-icon>
              <van-radio name="red" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
import { deleteUserReq, resetPasswordReq, getImageReq, qrCodeGetInfoByUserReq, continuousDayReq, changeCodeReq } from '../../../utils/api'
import SelectAddress from '../../commons/address/index.vue'
export default {
  props: {
    userInfo: {
      type: Object,//类型
      required: true,//必要性
      default: 0 //默认值
    }
  },
  name: 'AdminUserInfo',
  components: { SelectAddress },
  data() {
    return {
      changeCodeBox: false,
      radio: 'green',
      showSelectAddress: false,
      selectUserId: '',
      avatarUrl: '/img/default/defaultHead.png',
      tabStyle: {
        backgroundColor: '#00a94e'
      },
      day: 0,
      qrCodeInfo: {
        codeType: '',
        codeTypeName: ''
      }
    }
  },
  created() {
    this.createUrl()
    this.qrCodeGetInfoByUser()
    this.continuousDay()
  },
  watch: {
    qrCodeInfo: {
      deep: true, // 深度监视
      immediate: true, //初始化时让handler调用一下
      handler(newValue, oldVale) { //handler什么时候调用？当isHot发生改变时。
        switch (this.qrCodeInfo.codeType) {
          case "red":
            this.tabStyle.backgroundColor = "#e74033"
            break;
          case "yellow":
            this.tabStyle.backgroundColor = "#fcc72d"
            break;
          case "gray":
            this.tabStyle.backgroundColor = "#e2e3e5"
            break;
          case "green":
            this.tabStyle.backgroundColor = "#00a94e"
            break;
          default:
            break;
        }
      }
    }
  },
  methods: {
    createUrl() { // 查询头像图片流
      if (this.userInfo.user.avatar == null || this.userInfo.user.avatar.trim() == '') {
        return;
      }
      getImageReq(
        {
          path: this.userInfo.user.avatar
        },
        {}
      ).then((r) => {
        this.avatarUrl = window.URL.createObjectURL(r);
      });
    },
    qrCodeGetInfoByUser() { // 查询健康码
      qrCodeGetInfoByUserReq({ userId: this.userInfo.userId }).then(res => {
        if (res.code == 200) {
          this.qrCodeInfo = res.data
        } else {
          this.$toast("查询用户(" + this.userInfo.user.realName + ")健康码信息异常")
        }
      })
    },
    continuousDay() { // 查询健康打卡天数
      continuousDayReq({ userId: this.userInfo.userId }).then(res => {
        if (res.code == 200) {
          this.day = res.data
        }
      })
    },
    changeCode() { // 转码
      this.radio = this.qrCodeInfo.codeType
      this.changeCodeBox = true
    },
    confirm() {
      changeCodeReq({ userId: this.userInfo.userId, codeType: this.radio }).then(res => {
        this.$toast(res.message)
        if (res.code == 200) {
          this.qrCodeInfo.codeType = this.radio
          switch (this.qrCodeInfo.codeType) {
            case "red":
              this.qrCodeInfo.codeTypeName = "红码"
              break;
            case "yellow":
              this.qrCodeInfo.codeTypeName = "黄码"
              break;
            case "gray":
              this.qrCodeInfo.codeTypeName = "灰码"
              break;
            case "green":
              this.qrCodeInfo.codeTypeName = "绿码"
              break;
            default:
              this.qrCodeInfo.codeTypeName = "未知"
              break;
          }

        }
      })
    },
    resetPassword() { // 重置密码
      resetPasswordReq({ userId: this.userInfo.userId }).then(res => {
        this.$toast(res.message)
      })
    },
    deleteUser() {
      this.$dialog.confirm({
        title: '警告',
        message: '删除后无法恢复，确认删除？',
      })
        .then(() => {
          deleteUserReq({ userId: this.userInfo.userId }).then(res => {
            this.$toast(res.message)
            this.$bus.$emit("changeList", this.userInfo.userId) //使用自定义事件传递数据
          })
        })
        .catch(() => {
          // on cancel
        });
    }
  }
}
</script>

<style scoped>
.exceptionInfoBox {
  margin-top: 5px;
  background-color: white;
  padding: 5px;
}
.cell-button {
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
li {
  font-size: 14px;
  margin-bottom: 2px;
}
ul {
  padding: 5px;
}
.typeBox {
  color: white;
  border-radius: 5px;
  padding: 3px;
}
.aStyle {
  color: #666666;
  font-size: 13px;
}
.content {
  padding: 16px 16px 160px;
}
.infoBox {
  padding: 5px;
  font-size: 13px;
  color: #666666;
}
.lineBox {
  margin-top: 5px;
}
</style>