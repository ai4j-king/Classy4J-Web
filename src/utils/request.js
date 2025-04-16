import axios from 'axios'
import { ElMessage } from 'element-plus'
import { baseURL } from '../config'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL,
  timeout: 30000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理，比如添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里可以根据后端的响应结构进行统一处理
    console.log('响应数据:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: res
    })
    return res
  },
  error => {
    console.error('响应错误：', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    })
    const message = error.response?.data?.message || error.message || '请求失败'
    ElMessage.error(message)
    return Promise.reject(error)
  }
)

export default service