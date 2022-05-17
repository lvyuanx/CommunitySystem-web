<template>
  <div class="box">
    <nav-top-bar :leftArrow="true" :rightArrow="true" title="异常处理" />
    <van-tabs v-model="active" class="box tabBox">
      <van-tab title="未开始" class="box">
      </van-tab>
      <van-tab title="进行中">
      </van-tab>
      <van-tab title="已完成">
      </van-tab>
      <exception-group :active="active" />
    </van-tabs>
  </div>
</template>

<script>
import NavTopBar from '../../../commons/NavTopBar.vue'
import ExceptionGroup from './ExceptionGroup.vue'

export default {
  components: { NavTopBar, ExceptionGroup },
  name: "ManageException",
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style>
</style>