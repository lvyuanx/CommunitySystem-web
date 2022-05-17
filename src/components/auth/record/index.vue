<template>
  <div class="box">
    <nav-top-bar :leftArrow="true" :rightArrow="true" title="提交记录" />
    <van-tabs v-model="active" class="box tabBox">
      <van-tab title="健康" class="box">
      </van-tab>
      <van-tab title="异常">
      </van-tab>
      <record-group :active="active" />
    </van-tabs>
  </div>
</template>

<script>
import NavTopBar from "../../commons/NavTopBar.vue"
import RecordGroup from './RecordGroup.vue'

export default {
  name: "SubmitRecord",
  components: { NavTopBar, RecordGroup },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style>
</style>