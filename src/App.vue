<template>
  <div class="bg" style="width:100%;height:100%">
    <transition appear :name="transitionName">
      <router-view />
    </transition>

  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      transitionName: '',
      styles: {
        width: '100%',
        height: '100%',
        margin: '0px',
        padding: '0px',
      }
    }
  },
  watch: {
    //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (JSON.stringify(from.meta) != '{}') {
        if (to.meta.index > from.meta.index) {
          //设置动画名称
          this.transitionName = "slide-left";
        } else {
          this.transitionName = "slide-right";
        }
      }

    },
  },
  mounted() {
  }
}
</script>

<style>
.container-box {
  height: 100%;
}
.box {
  height: 100%;
  width: 100%;
}
.show {
  border: 1px solid #000;
}

/*路由切换动画 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.bg {
  background-color: #f7f8fa;
}
</style>
