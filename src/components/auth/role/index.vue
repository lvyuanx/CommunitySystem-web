<template>
  <div class="box">
    <nav-top-bar title="权限管理" :leftArrow="true" :rightArrow="true" />
    <van-tabs v-model="active" class="box tabBox">
      <van-tab title="角色" class="box">
        <role-manager />
      </van-tab>
      <van-tab title="用户">
        <role-user-manager />
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import NavTopBar from '../../commons/NavTopBar.vue'
import RoleManager from './RoleManager.vue'
import RoleUserManager from './RoleUserManager.vue'

export default {
  name: "Role",
  components: { NavTopBar, RoleManager, RoleUserManager },
  data() {
    return {
      active: 0
    }
  }
}
</script>

<style>
</style>