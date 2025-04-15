const config = {
  development: {
    baseURL: 'http://localhost:8081',
    apiPrefix: '/langchain'
  },
  production: {
    baseURL: 'http://localhost:8080', // 生产环境可以改为实际的域名
    apiPrefix: '/langchain'
  }
}

const env = import.meta.env.MODE || 'development'

export const { baseURL, apiPrefix } = config[env]

export const apiEndpoints = {
  chat: apiPrefix + '/chat-post'
} 