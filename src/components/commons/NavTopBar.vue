<template>
  <van-sticky :offset-top="0">
    <van-nav-bar :title="title" :left-text="leftText" :left-arrow="leftArrow" @click-left="onClickLeft" @click-right="onClickRight" fixed placeholder>
      <template #right v-if="rightArrow">
        <van-icon name="wap-home-o" size="18" />
      </template>
    </van-nav-bar>
  </van-sticky>
</template>

<script>
export default {
  name: 'NavTopBar',
  props: ["title", "leftArrow", "rightArrow"],
  data() {
    return {
      leftTextStr: "返回"
    }
  },
  methods: {
    /**返回 */
    onClickLeft() {
      this.$router.go(-1)
    },
    /**回到主页 */
    onClickRight() {
      this.$router.replace({ name: "home" });
    },
  },
  computed: {
    leftText() {
      return this.leftArrow ? this.leftTextStr : ""
    }
  }
};
</script>

<style scoped>
</style>