<template>
  <div id="wxs-popup" v-if="showPopup">
    <div :class="['showToast','wxs-' + params.icon]" v-if="params.show=='toast'">
      <span>{{params.title}}</span>
    </div>
    <div class='showModal' v-else-if="params.show=='modal'">
      <div class='modalBox'>
        <div class='modalMsg'>
          <h3>{{params.title}}</h3>
          <div class='text'>{{params.content}}</div>
        </div>
        <div class='modalBtn bordert'>
          <button class='docancel' v-if="params.showCancel" @click="closeModal({'cancel':true})">{{params.cancelText}}</button>
          <button class='doconfirm'  @click="closeModal({'confirm':true})">{{params.confirmText}}</button>
        </div>
      </div>
    </div>
    <div class='showWindow' v-else-if="params.show=='window'">
      <div class='winBox'>
        <span class='closeWin' @click="hideWindow" v-if="params.showClose"></span>
        <div class="winContent" v-html="params.innerHtml"></div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#wxs-popup {
  width: 100%;
  max-width: 750px;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 300;
  font-size: 14px;
  line-height: 130%;
  text-align: center;
}
#wxs-popup div span {
  height: 46px;
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
/* showToast */
.showToast {
  border-radius: 6px;
  -webkit-border-radius: 6px;
  -moz-border-radius: 6px;
  padding: 72px 12px 0px;
  width: 102px;
  height: auto;
  top: 48%;
  left: 50%;
  margin: -63px 0px 0px -63px;
  position: fixed;
  z-index: 400;
  color: #fff;
}
.wxs-loading {
  background: url(../../assets/ajax-loader.gif) no-repeat center 32px #000;
  background-size: 32px 32px;
  opacity: 0.72;
}
.wxs-success {
  background: url(../../assets/icon_success.png) no-repeat center 22px;
  background-size: 50px;
  background-color: rgba(0, 0, 0, 0.72);
}
.wxs-fail {
  background: url(../../assets/icon_fail.png) no-repeat center 22px;
  background-size: 50px;
  background-color: rgba(0, 0, 0, 0.72);
}
.wxs-none {
  background-color: rgba(0, 0, 0, 0.72);
  border-radius: 6px;
  padding: 6px 18px;
  width: auto;
  min-width: 120px;
  height: 46px;
  position: fixed;
  top: 49%;
  left: 50%;
  margin: 0px auto;
  display: block;
  -webkit-transform: translate(-50%, -50%);
  -moz-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
/* showWindow */
.showWindow,
.showModal {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.showWindow .winBox,
.showModal .modalBox {
  width: auto;
  height: auto;
  max-width: 88%;
  max-height: 88%;
  min-width: 200px;
  min-height: 200px;
  box-sizing: border-box;
  background: #fff;
  color: #333;
  position: relative;
  box-shadow: 0px 0px 6px #666;
  border-radius: 4px;
  margin-bottom: 10px;
}
.showWindow .winBox .closeWin {
  position: absolute;
  width: 32px;
  height: 32px !important;
  background: url(../../assets/icon_fail.png) no-repeat center #fff;
  background-size: 45%;
  box-shadow: 0 0 3px #888888;
  border-radius: 50%;
  right: -16px;
  top: -16px;
  cursor: pointer;
}
.showWindow .winBox .winContent {
  width: 100%;
}
.showWindow .winBox img {
  max-width: 250px;
}
/* showModal */
.showModal .modalBox {
  width: 328px;
  min-width: inherit;
  height: 190px;
  min-height: inherit;
}
.showModal .modalMsg {
  height: 88px;
  padding: 26px 20px 17px;
  text-align: center;
  font-size: 16px;
  color: #999;
  line-height: 150%;
}
.showModal .modalMsg h3 {
  font-size: 18px;
  text-align: center;
  margin-bottom: 15px;
  color: #131114;
}
.showModal .modalBtn {
  text-align: center;
  padding: 12px 30px 11px;
  font-size: 0px;
}
.showModal .modalBtn button {
  height: 33px;
  line-height: 27px;
  width: 50%;
  color: #576B95;
  font-size: 18px;
  vertical-align: top;
  margin: 0px auto;
  border: none;
  background: none;
}

</style>
<script>
  export default {
  	data: function() {
  	  return {}
  	},
    props: {
      showPopup: {
        type: Boolean,
        default: false
      },
      params:{
        type: Object,
        default: ()=> {
          return {}
        }
      }
    },
    methods: {
      execute: function(res){
        if(JSON.stringify(this.params) === "{}") return //防止重复执行
        try {
          typeof this.params.success === "function" && this.params.success(res)
        } catch(err) {
          typeof this.params.fail === "function" && this.params.fail(err)
        }
        typeof this.params.complete === "function" && this.params.complete(res);
        [this.params, this.showPopup] = [{}, false]
        this.$emit("status", false)
      },
      hideWindow: function(e) {
        this.execute(e)
      },
      closeModal: function(e) {
        this.execute(e)
      }
    },
    mounted: function() {
      //......
    },
    watch: {
      'showPopup' (to, from) {
        if(to) {
          if(this.params.show == "toast" && this.params.icon != "loading"){
            setTimeout(this.execute, this.params.duration)
          }
        } else if (!to && to != from) {
          this.execute()
        }
      }
    }
  }  
</script>
