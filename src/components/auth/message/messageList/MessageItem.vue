<template>
  <div class="box itemBox">
    <van-swipe-cell>
      <van-cell @click="showInfo" center :title="messageInfo.subject" :value="messageInfo.emailCreateDate" clickable :label="subContent" />
      <template #right v-if="active">
        <van-button square type="primary" @click="noRead" text="标为未读" style="height: 100%" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<script>
export default {
  props: {
    messageInfo: {
      type: Object,//类型
      required: true,//必要性
      default: 0 //默认值
    },
    active: {
      type: Number,//类型
      required: false,//必要性
      default: 0 //默认值
    }
  },
  name: "MessageItem",
  computed: {
    subContent() {
      if (this.messageInfo.content.length < 20) {
        return this.messageInfo.content
      } else {
        return this.messageInfo.content.substr(0, 20) + '...'
      }
    },
  },
  methods: {
    showInfo() {
      this.$bus.$emit("showInfo", this.messageInfo) //使用自定义事件传递数据
    },
    noRead() {
      this.$bus.$emit("noRead", this.messageInfo.emailId) //使用自定义事件传递数据
    }
  }
}
</script>

<style scoped>
.itemBox {
  background-color: white;
  margin-top: 3px;
}
</style>