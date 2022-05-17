/*
 * 仿微信小程序提示框、对话框、弹窗
 * created by maoeye
 */
import wxsComponent from '../components/massage/Wxs' //引入组件
const baseWxs = {
  install: function(Vue, options) {
  	// 创建构造器
  	const vueComponent = Vue.extend(wxsComponent) 
  	let wxsPopup
  	const initmyComponent = function() {
      wxsPopup = new vueComponent({
      	el: document.createElement("div")
      })
      document.body.appendChild(wxsPopup.$el);
  	}
    
    Vue.prototype.$wxs = {
      options: {
        status: false,  //true 表示已有样式执行,
        show: ""        //表示执行的哪个样式
      },
      init: function(params, options) {
        const self = this;
        if(!wxsPopup) {

          //初始化
      	  initmyComponent() 
          
          //通过$on来接收子组件的传值
          wxsPopup.$on("status", function(data) {
        	  self.options.status = data
          })
        }
        for(var i in options){
          params[i] = options[i];
        }
        return params;
      },
      showToast: function(options){
      	this.options.status = true
      	this.options.show = "toast"
        let params = {
          show: this.options.show,
          title: '加载中',
          icon: 'loading',
          duration: 1500,
          //success: function (res) {},
          //fail: function (res) {},
          //complete: function (res) {}
        }
        this.init(params, options)
        wxsPopup.params = params
        wxsPopup.showPopup = true
      },
      hideToast: function(options) {
        if(!this.options.status || this.options.show!="toast") return;
        wxsPopup.showPopup = false
      },
      showWindow: function(options) {
        if(this.options.status) return
        this.options.status = true
      	this.options.show = "window"
        let params = {
          show: this.options.show,
          showClose: true,
          innerHtml: ""
        }
        this.init(params, options)
        wxsPopup.params = params
        wxsPopup.showPopup = true
      },
      showLoading: function(options) {
        if(options && options.icon){
          options.icon = "loading"
        }
        this.showToast(options)
      },
      hideLoading: function(options) {
      	this.hideToast(options);
      },
      showModal: function(options){
        if(this.options.status) return
        this.options.status = true
      	this.options.show = "modal"
        let params = {    
          show: this.options.show,
          title: '提示',
          content: '',
          showCancel: true,        
          cancelText: '取消',
          confirmText: '确认'
        }
        this.init(params, options);
        wxsPopup.params = params
        wxsPopup.showPopup = true
      }
    }
  }
}
export default baseWxs

