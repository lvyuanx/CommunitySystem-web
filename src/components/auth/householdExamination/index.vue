<template>
  <div class="box">
    <nav-top-bar title="住户审批" :leftArrow="true" :rightArrow="true" />
    <!-- <van-tabs v-model="active" class="box tabBox">
      <van-tab title="用户入住" class="box"> -->
    <user-in-household />
    <!-- </van-tab>
      <van-tab title="用户搬出">内容 2</van-tab>
    </van-tabs> -->
  </div>
</template>

<script>
import NavTopBar from '../../commons/NavTopBar.vue'
import UserInHousehold from './UserInHousehold.vue'
export default {
  name: 'HouseholExamination',
  components: { NavTopBar, UserInHousehold },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style scoped>
/* .tabBox > :last-child {
  height: 100% !important;
} */
</style>