<template>
  <div id="box">
    <div class="bgColor"></div>
    <div class="txt">{{ text }}</div>
    <div class="slider">
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
      successMoveDistance: "",
      slider: null,
      downX: '',
    };
  },
  mounted() {
    this.$bus.$on("loginError", () => { //在总线上创建自定义事件用于接收数据
      this.isSuccess = false
      this.text = "滑动登录"
      this.txt.style.color = "#00bffe";
      this.isSuccess = false
      this.mouseupHandler();
    })
    this.load();
    window.onresize = () => { // 监听页面变化
      return (() => {
        this.load();
      })()
    };
  },
  beforeDestroy() {
    this.$bus.$off("loginError") //生命周期结束，销毁自定义事件
  },
  methods: {
    load() {
      let box = this.getEle("#box"); //容器
      this.bgColor = this.getEle(".bgColor"); //背景色
      this.txt = this.getEle(".txt"); //文本
      this.slider = this.getEle(".slider"); //滑块
      this.successMoveDistance = box.offsetWidth - this.slider.offsetWidth; //解锁需要滑动的距离
      this.slider.onmousedown = this.mousedownHandler
      this.slider.ontouchstart = this.mousedownHandler
    },
    //按下
    mousedownHandler(e) {
      this.bgColor.style.transition = "";
      this.slider.style.transition = "";
      var e = e || window.event || e.which;
      this.downX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      if (!this.isSuccess) {
        //在鼠标按下时，分别给鼠标添加移动和松开事件
        document.onmousemove = this.mousemoveHandler;
        document.onmouseup = this.mouseupHandler;
        //添加移动端对应事件
        document.ontouchmove = this.mousemoveHandler;
        document.ontouchend = this.mouseupHandler;
      }
    },
    //滑动
    mousemoveHandler(e) {
      var e = e || window.event || e.which;
      var moveX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      var offsetX = this.getOffsetX(moveX - this.downX, 0, this.successMoveDistance);
      this.bgColor.style.width = moveX - 30 + "px";
      this.slider.style.left = offsetX + "px";
      if (offsetX == this.successMoveDistance) {
        this.isSuccess = true;
        this.bgColor.style.width = offsetX + this.downX - 30 + "px";
        this.slider.style.left = offsetX + "px";

        //滑动成功时，移除鼠标按下事件和鼠标移动事件
        this.slider.onmousedown = null;
        document.onmousemove = null;
        //移除移动端事件
        document.ontouchstart = null;
        document.ontouchmove = null;

        this.success();
      }
      //如果不设置滑块滑动时会出现问题（目前还不知道为什么）
      e.preventDefault();
    },
    //松开
    mouseupHandler(e) {
      if (!this.isSuccess) {
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
    left: 0;
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
