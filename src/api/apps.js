import request from '@/utils/request'

// 创建应用
export function createApp(data) {
  return request({
    url: '/api/v1/apps/create',
    method: 'post',
    data
  })
}

// 更新应用配置
export function updateAppConfig(appId, data) {
  return request({
    url: `/api/v1/apps/${appId}/config`,
    method: 'put',
    data
  })
}

// 更新应用状态
export function updateAppStatus(appId, data) {
  return request({
    url: `/api/v1/apps/${appId}/status`,
    method: 'put',
    data
  })
}

// 删除应用
export function deleteApp(appId) {
  return request({
    url: `/api/v1/apps/${appId}`,
    method: 'delete'
  })
}

// 获取应用列表
export function listApps(params) {
  return request({
    url: '/api/v1/apps/listApps',
    method: 'get',
    params
  })
}

// 获取应用详情
export function getAppById(appId) {
  return request({
    url: `/api/v1/apps/${appId}`,
    method: 'get'
  })
}