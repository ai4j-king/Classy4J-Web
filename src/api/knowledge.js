import axios from 'axios'
import { baseURL } from '@/config'

// 创建axios实例
const service = axios.create({
  baseURL: baseURL,
  timeout: 15000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在这里可以添加token等认证信息
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    // 这里可以根据后端的响应结构进行数据处理
    return res
    //return Promise.reject(new Error(res.message || '请求失败'))
  },
  error => {
    return Promise.reject(error)
  }
)

/**
 * 创建空知识库
 * @param {string} name - 知识库名称
 * @returns {Promise} 返回创建结果
 */
export function createEmptyKnowledge(name) {
  return "success"
  // TODO: 有接口后启用
  // return service({
  //   url: '/create-new-kowledge',
  //   method: 'post',
  //   data: { name }
  // })
}

// 保存并处理知识库设置
export function saveAndHandle(data) {
  return "success"
  // TODO: 有接口后启用
  // return request({
  //   url: '/save-handle-kowledge',
  //   method: 'post',
  //   data
  // })
} 

/**
 * 获取知识库列表
 * @returns {Promise} 返回知识库列表数据
 */
export function fetchKnowledgeList() {
  return service({
    url: baseURL + '/api/datasets',
    method: 'get'
  })
}