<template>
  <div class="box">
    <nav-top-bar title="用户管理" :leftArrow="true" :rightArrow="true" />
    <van-tabs v-model="active" class="box tabBox">
      <van-tab title="社区住户" class="box">
      </van-tab>
      <van-tab :disabled="! isAdmin" title="管理员">
      </van-tab>
      <van-tab title="非社区用户">
      </van-tab>
      <UserGroup :active="active" />
    </van-tabs>
  </div>
</template>

<script>
import { findUserFunctionReq } from '../../../utils/api'
import NavTopBar from '../../commons/NavTopBar.vue'
import UserGroup from './UserGroup.vue'
export default {
  components: { NavTopBar, UserGroup },
  name: "UserManagement",
  data() {
    return {
      active: 0,
      isAdmin: false,
    }

  },
  created() {
    this.isAdminCheck();
  },
  methods: {
    isAdminCheck() {
      findUserFunctionReq().then(res => {
        if (res.code == 200) {
          let labelArr = res.data.map(item => item.label);
          console.log(labelArr)
          if (labelArr.indexOf("role") > -1) {
            this.isAdmin = true
          } else {
            this.isAdmin = false
          }
        }
      })
    },
  }
}
</script>

<style scoped>
</style>