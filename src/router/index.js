// 引入路由组件
import VueRouter from 'vue-router'

export default new VueRouter({
	routes: [
		// {
		// 	// 登录组件
		// 	name: 'login',
		// 	path: '/',
		// 	component: () => import('../components/login/Login'),
		// 	meta: {
		// 		index: 1
		// 	}
		// },
		{
			// 登录组件
			name: 'userLogin',
			path: '/',
			component: () => import('../components/login/UserLogin.vue'),
			meta: {
				index: 1
			}
		},
		{
			// 注册组件
			name: 'register',
			path: '/register',
			component: () => import('../components/register/Register'),
			meta: {
				index: 2
			}
		},
		{
			// 首页
			name: 'indx',
			path: '/index',
			component: () => import('../components/auth/index'),
			meta: {
				index: 3
			},
			children: [
				{
					name: 'home',
					path: '/home',
					component: () => import('../components/auth/home/Home'),
					meta: {
						index: 4
					}
				},
				{
					name: 'community',
					path: '/community',
					component: () => import('../components/auth/community/Community'),
					meta: {
						index: 5
					}
				},
				{
					name: 'center',
					path: '/center',
					component: () => import('../components/auth/center/Center.vue'),
					meta: {
						index: 6
					}
				}
			]
		},
		{
			name: 'inAndOut',
			path: '/inAndOut',
			component: () => import('../components/auth/registration/InAndOut'),
			meta: {
				index: 7
			}
		},
		{
			name: 'householExamination',
			path: '/householExamination',
			component: () => import('../components/auth/householdExamination/index'),
			meta: {
				index: 7
			}
		},
		{
			name: 'addException',
			path: '/addException',
			component: () => import('../components/auth/communityException/add'),
			meta: {
				index: 7
			}
		},
		{
			name: 'manageException',
			path: '/manageException',
			component: () => import('../components/auth/communityException/manage'),
			meta: {
				index: 7
			}
		},
		{
			name: 'temperatureRegistration',
			path: '/temperatureRegistration',
			component: () => import('../components/auth/registration/TemperatureRegistration'),
			meta: {
				index: 7
			}
		},
		{
			name: 'userManagement',
			path: '/userManagement',
			component: () => import('../components/auth/user/index'),
			meta: {
				index: 7
			}
		},
		{
			name: 'role',
			path: '/role',
			component: () => import('../components/auth/role/index'),
			meta: {
				index: 7
			}
		},
		{
			name: 'message',
			path: '/message',
			component: () => import('../components/auth/message/index'),
			meta: {
				index: 7
			}
		},
		{
			name: 'posters',
			path: '/posters',
			component: () => import('../components/auth/posters/index'),
			meta: {
				index: 7
			}
		},
		{
			name: 'setting',
			path: '/setting',
			component: () => import('../components/auth/center/settings/Setting'),
			meta: {
				index: 7
			}
		},
		{
			name: 'qrCode',
			path: '/qrCode',
			component: () => import('../components/auth/center/QrCode/QrCode'),
			meta: {
				index: 7
			}
		},
		{
			name: 'updatePassword',
			path: '/updatePassword',
			component: () => import('../components/auth/center/update/UpdatePassword'),
			meta: {
				index: 8
			}
		},
		{
			name: 'messageList',
			path: '/messageList',
			component: () => import('../components/auth/message/messageList/index'),
			meta: {
				index: 8
			}
		},
		{
			name: 'submitRecord',
			path: '/submitRecord',
			component: () => import('../components/auth/record/index'),
			meta: {
				index: 8
			}
		},
		{
			name: 'userInfo',
			path: '/userInfo',
			component: () => import('../components/auth/center/info/UserInfo'),
			meta: {
				index: 9
			}
		},
		{
			name: 'updateUserInfo',
			path: '/updateUserInfo',
			component: () => import('../components/auth/center/update/UpdateUserInfo'),
			meta: {
				index: 10
			}
		},
		{
			name: 'add',
			path: '/add',
			component: () => import('../components/auth/community/add/Add'),
			meta: {
				index: 11
			},
			redirect: '/addPeriod',
			children: [
				{
					name: 'addPeriod',
					path: '/addPeriod',
					component: () => import('../components/auth/community/add/AddPeriod'),
					meta: {
						index: 12
					}
				},
				{
					name: 'addBuilding',
					path: '/addBuilding/:period',
					component: () => import('../components/auth/community/add/AddBuilding'),
					meta: {
						index: 13
					}
				},
				{
					name: 'unit',
					path: '/unit/:building',
					component: () => import('../components/auth/community/add/AddUnit'),
					meta: {
						index: 14
					}
				},
				{
					name: 'layer',
					path: '/layer/:unit',
					component: () => import('../components/auth/community/add/AddLayer'),
					meta: {
						index: 15
					}
				},
				{
					name: 'household',
					path: '/household/:layer',
					component: () => import('../components/auth/community/add/AddHousehold'),
					meta: {
						index: 16
					}
				}
			]
		}
	]
})
