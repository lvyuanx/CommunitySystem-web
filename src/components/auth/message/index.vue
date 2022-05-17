<template>
  <div class="box">
    <nav-top-bar title="消息发布" :leftArrow="true" :rightArrow="true" style="margin-top: 5px" />
    <van-form @submit="onSubmit">
      <van-field readonly v-model="toStr" rows="1" autosize label="接受者" placeholder="请点击选择用户" type="textarea" :rules="[{ required: true, message: '请填写接收用户' }]">
        <template #button>
          <van-button size="small" native-type="button" @click="showUserSelectBox" type="info">选择</van-button>
        </template>
      </van-field>
      <van-field v-model="subject" name="主题" label="主题" placeholder="主题" :rules="[{ required: true, message: '请填写主题' }]" />
      <van-field v-model="content" rows="3" maxlength="150" autosize label="正文" type="textarea" placeholder="请输入正文" :rules="[{ required: true, message: '请填写正文' }]" />
      <van-cell center :title="title">
        <template #right-icon>
          <van-switch v-model="checked" size="24" />
        </template>
      </van-cell>
      <div style="margin: 16px;">
        <van-button round block type="info" icon="envelop-o" native-type="submit">发送</van-button>
      </div>
    </van-form>
    <select-user :isShow="showUserSelect" />
  </div>
</template>

<script>
import NavTopBar from '../../commons/NavTopBar.vue'
import SelectUser from '../../commons/user/SelectUser.vue'
import { sendSimpleMessageReq } from '../../../utils/api'

export default {
  name: "Message",
  components: { NavTopBar, SelectUser },
  data() {
    return {
      checked: true,
      title: '发送邮件',
      isSenderEmail: 1,
      to: [],
      content: '',
      subject: '',
      toStr: '',
      toName: [],
      showUserSelect: false,
    }
  },

  watch: {
    checked: {
      immediate: true,
      handler() {
        if (this.checked) {
          this.title = "发送邮件"
          this.isSenderEmail = 1
        } else {
          this.title = '仅消息提醒'
          this.isSenderEmail = 0
        }
      }
    },
  },
  mounted() {
    this.$bus.$on("changeShow", (data) => { //在总线上创建自定义事件用于接收数据
      this.showUserSelect = data
    })
    this.$bus.$on("selectUserReslut", (data) => { //在总线上创建自定义事件用于接收数据
      this.to = []
      this.toName = []
      this.toStr = ''
      console.log("bcc", data)
      data.forEach(element => {
        let email = element.email
        let userName = element.realName
        let userId = element.id
        if (email.trim() != '') {
          this.to.push(userId)
          this.toName.push(userName + "(" + email + ")")
          this.toStr = this.toName.join("; ")
        }


      });
    })
  },
  beforeDestroy() {
    this.$bus.$off("changeShow") //生命周期结束，销毁自定义事件
    this.$bus.$off("selectUserReslut")
  },
  methods: {
    sendSimpleMessage() {
      let data = {
        isSenderEmail: this.isSenderEmail,
        to: this.to,
        content: this.content,
        subject: this.subject,
      }
      sendSimpleMessageReq({}, data).then(res => {
        if (res.code == 200) {
          this.$toast.success("发送成功")
          this.handlData()
        } else {
          this.$toast(res.message)
        }
      })
    },
    showUserSelectBox() {
      this.showUserSelect = true
    },
    onSubmit() {
      this.sendSimpleMessage()
    },
    handlData() {
      this.checked = true
      this.title = '发送邮件'
      this.isSenderEmail = 1
      this.to = []
      this.content = ''
      this.subject = ''
      this.toStr = ''
      this.toName = []
      this.showUserSelect = false
    }
  }
}
</script>

<style>
</style>