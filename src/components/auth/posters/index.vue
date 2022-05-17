<template>
  <div class="box">
    <nav-top-bar title="更换海报" :leftArrow="true" :rightArrow="true" />
  </div>
</template>

<script>
import NavTopBar from '../../commons/NavTopBar.vue'

export default {
  name: "Posters",
  components: { NavTopBar }
}
</script>

<style>
</style>