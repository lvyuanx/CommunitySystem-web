import axios from 'axios'
import { getStore, setStore } from './storage'
import router from '../router/index'
import { Toast } from 'vant';
// 统一请求路径前缀
// const base = '/ccma-server/api'   // 服务器地址/
const base = '/api'   // 本地///
// 超时设定
axios.defaults.timeout = 15000

axios.interceptors.request.use(config => {
  return config
}, err => {
  Toast.fail('请求超时')
  return Promise.reject(err)
})


// http response 拦截器
axios.interceptors.response.use(response => {
  const data = response.data
  const msg = data.message
  // 根据返回的code值来做不同的处理(和后端约定)
  switch (data.code) {
    case 401:
      // 未登录 清除已登录状态
      setStore('L-Token', '')
      if (router.history.current.name !== '/') {
        router.replace('/')
        if (msg !== null) {
          Toast.fail(msg)
        } else {
          Toast.fail("登录失效，请重新登录")
        }
      }
      break
    case 403:
      // 没有权限
      if (msg !== null) {
        Toast.fail(msg)
      } else {
        Toast.fail("系统异常！")
      }
      break
    case 500:
      // 错误
      if (msg == null)  {
        Toast.fail("系统异常！")
      }
      break
    default:
      return data
  }

  return data
}, (err) => {
  // 返回状态码不为200时候的错误处理
  Toast.fail(err.toString())
  return Promise.resolve(err)
})

export const getRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-Token': LToken
    }
  })
}

export const postRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'Content-Type': 'application/json',
      'L-Token': LToken
    }
  })
}

export const putRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'put',
    url: `${base}${url}`,
    params: params,
    data: data,
    transformRequest: [function (data) {
      let ret = ''
      for (const it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    headers: {
      'Content-Type': 'application/json',
      'L-Token': LToken
    }
  })
}

export const deleteRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const importRequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    params: params,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const uploadFileRequest = (url, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: data,
    headers: {
      'L-TOKEN': LToken
    }
  })
}

export const IORequest = (url, params, data) => {
  const LToken = getStore("L-Token")
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    data: data,
    responseType: 'blob',
    headers: {
      'L-TOKEN': LToken
    }
  })
}

