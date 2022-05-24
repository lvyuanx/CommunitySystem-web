<template>
  <div id="box">
    <div class="bgColor"></div>
    <div class="txt">{{ text }}</div>
    <div class="slider" @touchstart='touchstart' @touchmove='touchmove' @touchend="touchend">
      <i v-show="!isSuccess" class="iconfont icon-youfanye"></i>
      <i v-show="isSuccess" class="iconfont icon-chenggong"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "slideToUnLock",
  props: {
    username: {
      type: String,
      default() {
        return "";
      },
    },
    password: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      text: "滑动登录",
      isSuccess: false,
      bgColor: null,
      txt: "",
      successMoveDistance: 0, // 最大滑行距离
      slider: null,
      startX: 0,
      nowX: 0,
      offsetX: 0,
    };
  },
  mounted() {

    this.$bus.$on("loginError", () => { //在总线上创建自定义事件用于接收数据
      this.isSuccess = false
      this.text = "滑动登录"
      this.txt.style.color = "#00bffe";
      this.bgColor.style.width = 0 + "px"; // 调整背景颜色
      this.slider.style.left = -5 + "px";  // 调整滑块的偏移距离
      this.bgColor.style.transition = "width 0.5s linear";
      this.slider.style.transition = "left 0.5s linear";
    })
    this.bgColor = this.getEle(".bgColor"); //背景色
    this.txt = this.getEle(".txt"); //文本
    this.slider = this.getEle(".slider"); //滑块
    this.successMoveDistance = box.offsetWidth - this.slider.offsetWidth; //解锁需要滑动的距离
    // 归位
    this.bgColor.style.width = 0 + "px";
    this.slider.style.left = 0 + "px";
  },
  beforeDestroy() {
    this.$bus.$off("loginError") //生命周期结束，销毁自定义事件
  },
  methods: {
    touchstart(e) {
      // 如果你要阻止点击事件，请反注释下一行代码
      // e.preventDefault()
      this.startX = e.targetTouches[0].pageX;
    },
    touchmove(e) {
      // e.preventDefault()
      this.nowX = e.targetTouches[0].pageX
      this.offsetX = this.nowX - this.startX
      this.offsetX = this.getOffsetX(this.offsetX, 0, this.successMoveDistance) // 计算偏移量，防止出界
      this.bgColor.style.width = this.offsetX + (this.slider.offsetWidth / 2) + "px"; // 调整背景颜色
      this.bgColor.style.backgroundColor = "#009dd0";
      this.slider.style.left = this.offsetX + "px";  // 调整滑块的偏移距离
      this.bgColor.style.transition = "width 0s linear";
      this.slider.style.transition = "left 0s linear";
    },
    touchend(e) {
      if (this.offsetX == this.successMoveDistance) { // 滑动到终点松开
        this.success()
      } else { // 中途松开
        this.bgColor.style.width = 0 + "px";
        this.slider.style.left = 0 + "px";
        this.bgColor.style.transition = "width 0.6s linear";
        this.slider.style.transition = "left 0.6s linear";
      }
    },
    getEle(selector) {
      return document.querySelector(selector);
    },
    getOffsetX(offset, min, max) {
      if (offset < min) {
        offset = min;
      } else if (offset > max) {
        offset = max;
      }
      return offset;
    },
    success() {
      this.text = "登陆中";
      this.bgColor.style.backgroundColor = "#009dd0";
      this.txt.style.color = "#fff";
      this.slider.style.left = this.successMoveDistance + "px";
      this.isSuccess = true;
      this.$emit("actionLogin");
    },
  },
};
</script>

<style lang="less" scoped>
* {
  touch-action: pan-y;
}
#box {
  position: relative;
  width: 300px;
  height: 42px;
  border-radius: 21px;
  margin: 0 auto;
  margin-top: 30px;
  background-color: #e6f7ff;
  // box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  .bgColor {
    position: absolute;
    left: 0;
    top: 0;
    width: 42px;
    height: 42px;
    background-color: lightblue;
    border-radius: 1rem;
  }
  .txt {
    position: absolute;
    width: 100%;
    height: 42px;
    line-height: 42px;
    border-radius: 21px;
    font-size: 14px;
    color: #00bffe;
    text-align: center;
  }
  .slider {
    position: absolute;
    left: 0px;
    top: -5px;
    width: 54px;
    height: 54px;
    border-radius: 27px;
    /* border: 1px solid #ccc; */
    background: #fff;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
    text-align: center;
    cursor: move;
  }
  .slider > i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-weight: 550;
    font-size: 20px;
  }
  .icon-duigou {
    color: #66f096;
  }
}
</style>
