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
    };
  },
  mounted() {
    this.$bus.$on("loginError", () => { //在总线上创建自定义事件用于接收数据
      isSuccess = false
      this.text = "滑动登录"
      this.txt.style.color = "#00bffe";
      this.isSuccess = false
      mouseupHandler();
    })
    let _this = this;
    let isSuccess = _this.isSuccess;
    let box = this.getEle("#box"); //容器
    this.bgColor = this.getEle(".bgColor"); //背景色
    let bgColor = this.bgColor;
    this.txt = this.getEle(".txt"); //文本
    let slider = this.getEle(".slider"); //滑块
    this.slider = slider;
    let icon = this.getEle(".slider>i");
    let successMoveDistance = box.offsetWidth - slider.offsetWidth; //解锁需要滑动的距离
    this.successMoveDistance = successMoveDistance;
    let downX;
    slider.onmousedown = mousedownHandler;
    slider.ontouchstart = mousedownHandler;
    //按下
    function mousedownHandler(e) {
      bgColor.style.transition = "";
      slider.style.transition = "";
      var e = e || window.event || e.which;
      downX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      if (!this.isSuccess) {
        //在鼠标按下时，分别给鼠标添加移动和松开事件
        document.onmousemove = mousemoveHandler;
        document.onmouseup = mouseupHandler;
        //添加移动端对应事件
        document.ontouchmove = mousemoveHandler;
        document.ontouchend = mouseupHandler;
      }
    }
    //滑动
    function mousemoveHandler(e) {
      var e = e || window.event || e.which;
      var moveX = e.clientX ? e.clientX : e.changedTouches[0].clientX;
      var offsetX = _this.getOffsetX(moveX - downX, 0, successMoveDistance);
      bgColor.style.width = moveX - 30 + "px";
      slider.style.left = offsetX + "px";

      if (offsetX == successMoveDistance) {
        isSuccess = true;
        bgColor.style.width = offsetX + downX - 30 + "px";
        slider.style.left = offsetX + "px";
        _this.success();
        //滑动成功时，移除鼠标按下事件和鼠标移动事件
        slider.onmousedown = null;
        document.onmousemove = null;
        //移除移动端事件
        document.ontouchstart = null;
        document.ontouchmove = null;
      }
      //如果不设置滑块滑动时会出现问题（目前还不知道为什么）
      e.preventDefault();
    }
    //松开
    function mouseupHandler(e) {
      if (!isSuccess) {
        bgColor.style.width = 0 + "px";
        slider.style.left = 0 + "px";
        bgColor.style.transition = "width 0.6s linear";
        slider.style.transition = "left 0.6s linear";
      }
    }
  },
  beforeDestroy() {
    this.$bus.$off("loginError") //生命周期结束，销毁自定义事件
  },
  methods: {
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
    // login() {
    //   const userName = this.username.trim();
    //   const userPwd = encryptedData(this.password);
    //   this.$store
    //     .dispatch("login", {
    //       userName: userName,
    //       passWord: userPwd,
    //       verifyCode: "",
    //     })
    //     .then((res) => {
    //       if (res.data.code === 200) {
    //         this.text = "登录成功";
    //         this.isSuccess = true;
    //         this.$router.push("/homepage");
    //         this.isSuccess = false;
    //         this.slider.style.left = 0 + "px";
    //       } else {
    //         Toast(res.data.message);
    //       }
    //     })
    //     .catch((err) => {
    //       Toast(err.data.message);
    //       this.username = "";
    //       this.password = "";
    //     });
    // },
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
