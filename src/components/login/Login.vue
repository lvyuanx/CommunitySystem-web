<template>
  <div class="container-fluid container-box">
      <LoginTable/>
      <Footer />
  </div>

</template>

<script>
import LoginTable from './LoginTable.vue'
import Footer from '../footer/Foter.vue'
export default {
  name: "Login",
  components: {
      LoginTable,
      Footer
  },
 
};
</script>

<style scoped>

</style>