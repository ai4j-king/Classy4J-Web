import request from '@/utils/request'

// 获取LLM模型列表
export function getLLMModels() {
  return request({
    url: '/api/workspaces/current/models/model-types/llm',
    method: 'get'
  })
}