<template>
  <div class="w-100 h-100">
    <!-- 路由页面跳转 Start -->
    <transition
      appear 
      :name="transitionName"
    >
      <router-view />
    </transition>
    <!-- 路由页面跳转 End -->
    <!-- 底栏Tabbr Start -->  
    <div style="height: 4rem"></div>
     <van-tabbar id="nav" flex v-model="active" route  ref='navBarBox'>
      <van-tabbar-item replace to="/home" name="home" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item replace to="/community" name="community" icon="shop-o">社区</van-tabbar-item>
      <van-tabbar-item replace to="/center" name="center" icon="friends-o">个人</van-tabbar-item>
    </van-tabbar>
    <!-- 底栏Tabbr End --> 
  </div>
</template>

<script>

export default {
  name: "Index",
  data(){
    return{
      active: 'home',
      transitionName: '',
    }
  },
  mounted(){
  },
   watch:{
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index) {
        //设置动画名称
        this.transitionName = "slide-left";
      } else {
        this.transitionName = "slide-right";
      }
    },
  },
  methods:{
  }
}
</script>

<style scoped>

</style>