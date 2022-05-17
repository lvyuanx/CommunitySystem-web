<template>
  <div class="box">
    <nav-top-bar :leftArrow="true" :rightArrow="true" title="社区消息" />
    <van-tabs v-model="active" class="box tabBox">
      <van-tab title="未读" class="box">
      </van-tab>
      <van-tab title="已读">
      </van-tab>
      <list-group :active="active" />
    </van-tabs>

  </div>
</template>

<script>
import NavTopBar from '../../../commons/NavTopBar.vue'
import ListGroup from './ListGroup.vue'
export default {
  components: { NavTopBar, ListGroup },
  name: "MessageList",
  data() {
    return {
      active: 0
    }
  }

}
</script>

<style>
</style>