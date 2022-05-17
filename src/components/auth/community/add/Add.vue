<template>
  <div style="width: 100%">
    <NavTopBar :title="navTitle" :leftArrow="true" :rightArrow="true" />
    <van-steps :active="active" style="margin-top: 10px">
      <van-step>期</van-step>
      <van-step>栋</van-step>
      <van-step>单元</van-step>
      <van-step>层</van-step>
      <van-step>房间</van-step>
    </van-steps>
    <router-view style="margin-top: 10px"></router-view>
  </div>
</template>

<script>
import NavTopBar from "../../../commons/NavTopBar";
export default {
  name: "Add",
  components: {
    NavTopBar,
  },
  data() {
    return {
      active: 0,
      navTitle: ''
    };
  },
  created() {
    this.$bus.$on("active", (data) => {
      this.active = data
    });
    this.$bus.$on("title", (data) => {
      this.navTitle = data
    });
  },
  beforeDestroy() {
    this.$bus.$off("active"); //生命周期结束，销毁自定义事件
  },
};
</script>

<style>
</style>