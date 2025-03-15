import axios from 'axios'
import { baseURL, apiEndpoints } from '../config'

// 创建axios实例
const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 发送聊天消息
export const sendChatMessage = async (message) => {
  try {
    const response = await api.post(apiEndpoints.chat, { message })
    console.log(response)

    // return response.data
    return response
  } catch (error) {
    console.error('发送消息失败:', error)
    throw error
  }
} 