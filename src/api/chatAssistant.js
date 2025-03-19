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
    console.log('message：' + message.message + '   model：' + message.model )
    const response = await api.post(apiEndpoints.chat, { message })
    console.log(response)

    // return response.data
    return response
  } catch (error) {
    console.error('发送消息失败:', error)
    throw error
  }
}

export const createChatHelper = async () => {
  try {
    // const response = await axios.post(`${BASE_URL}/createChatHelper`)
    // return response.data
    return "success"
  } catch (error) {
    throw error
  }
} 