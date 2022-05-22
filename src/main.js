import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap/dist/js/bootstrap.js'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import VueRouter from 'vue-router'
import 'vant/lib/index.css'
import './utils/appback' //解决hbuilder打包vue项目app点击手机返回键直接退出app的问题
import './assets/font/iconfont/iconfont.css'

// 引入路由器
import router from './router/index'
// 引入storage工具
import {
	setStore,
	getStore,
	removeStore,
	setLStore,
	getLStore,
	removeLStore
} from './utils/storage'
import less from 'less'
// vant组件
import {
	Toast,
	Tabbar,
	TabbarItem,
	Image as VanImage,
	NavBar,
	Icon,
	Cell,
	CellGroup,
	Switch,
	Popup,
	Form,
	Field,
	Button,
	Uploader,
	RadioGroup,
	Radio,
	Dialog,
	TreeSelect,
	Sticky,
	Col,
	Row,
	Step,
	Steps,
	Picker,
	Sidebar,
	SidebarItem,
	List,
	PullRefresh,
	Grid,
	GridItem,
	Empty,
	Cascader,
	Skeleton,
	Swipe,
	SwipeItem,
	NoticeBar,
	Search,
	Tab,
	Tabs,
	SwipeCell,
	Card,
	Divider,
	ActionSheet,
	Tag,
	DropdownMenu,
	DropdownItem,
	Checkbox,
	CheckboxGroup,
	Slider
} from 'vant'
// uuid
import UUID from 'vue-uuid'

Vue.config.productionTip = false
Vue.use(VueRouter)
	.use(Toast)
	.use(Tabbar)
	.use(TabbarItem)
	.use(Switch)
	.use(Popup)
	.use(Button)
	.use(Radio)
	.use(RadioGroup)
	.use(Sticky)
	.use(VanImage)
	.use(NavBar)
	.use(Icon)
	.use(Cell)
	.use(CellGroup)
	.use(Form)
	.use(Field)
	.use(Uploader)
	.use(Dialog)
	.use(TreeSelect)
	.use(Col)
	.use(Row)
	.use(UUID)
	.use(Step)
	.use(Steps)
	.use(Picker)
	.use(Sidebar)
	.use(SidebarItem)
	.use(List)
	.use(PullRefresh)
	.use(Grid)
	.use(GridItem)
	.use(Empty)
	.use(Cascader)
	.use(Skeleton)
	.use(Swipe)
	.use(SwipeItem)
	.use(NoticeBar)
	.use(Search)
	.use(Tab)
	.use(Tabs)
	.use(SwipeCell)
	.use(Card)
	.use(Divider)
	.use(ActionSheet)
	.use(Tag)
	.use(DropdownMenu)
	.use(DropdownItem)
	.use(Checkbox)
	.use(CheckboxGroup)
	.use(Slider)
	.use(less)
Vue.prototype.setStore = setStore
Vue.prototype.getStore = getStore
Vue.prototype.removeStore = removeStore
Vue.prototype.setLStore = setLStore
Vue.prototype.getLStore = getLStore
Vue.prototype.removeLStore = removeLStore

new Vue({
	render: h => h(App),
	beforeCreate() {
		Vue.prototype.$bus = this // 安装全局事件总线
	},
	router
}).$mount('#app')
