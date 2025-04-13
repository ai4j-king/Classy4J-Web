import request from '@/utils/request'

// 发送消息
export function sendMessage(appId, data) {
  return request({
    url: `/api/apps/${appId}/chat-messages`,
    method: 'post',
    data
  })
}

// 获取历史记录
export function getHistory(appId, params) {
  return request({
    url: `/api/v1/apps/${appId}/chat/messages`,
    method: 'get',
    params
  })
}

// 删除消息
export function deleteMessage(appId, messageId) {
  return request({
    url: `/api/v1/apps/${appId}/chat/messages/${messageId}`,
    method: 'delete'
  })
}

// 导出历史记录
export function exportHistory(appId, params) {
  return request({
    url: `/api/v1/apps/${appId}/chat/messages/export`,
    method: 'get',
    params,
    responseType: 'blob'
  })
}