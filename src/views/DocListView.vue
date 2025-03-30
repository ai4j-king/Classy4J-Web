<template>
  <div class="page-container">
    <!-- 左侧导航栏 -->
    <div class="side-nav">
      <el-tooltip content="文档" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'doc' }" @click="switchNav('doc')">
          <el-icon><Document /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="召回测试" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'history' }" @click="switchNav('history')">
          <el-icon><Timer /></el-icon>
        </div>
      </el-tooltip>
      <el-tooltip content="设置" placement="right">
        <div class="nav-item" :class="{ active: currentNav === 'settings' }" @click="switchNav('settings')">
          <el-icon><Setting /></el-icon>
        </div>
      </el-tooltip>
    </div>

    <!-- 右侧主要内容区域 -->
    <div class="main-container">
      <!-- 文档列表页面 -->
      <div v-if="currentNav === 'doc'" class="doc-list">
        <!-- 页面标题 -->
        <div class="page-title">
          <h2>文档</h2>
        </div>

        <!-- 顶部搜索区域 -->
        <div class="search-bar">
          <el-input
            v-model="searchQuery"
            placeholder="搜索"
            class="search-input"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <div class="right-buttons">
            <el-button plain @click="showMetadataDialog = true">
              <el-icon><DataAnalysis /></el-icon>
              元数据
            </el-button>
            <el-button type="primary" @click="handleAddFile">
              <el-icon><Plus /></el-icon>
              添加文件
            </el-button>
          </div>
        </div>

        <!-- 文件列表表格 -->
        <el-table
          :data="filteredTableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          ref="tableRef"
        >
          <el-table-column type="selection" width="50" />
          <el-table-column label="#" width="60" type="index" />
          <el-table-column prop="name" label="名称" min-width="200">
            <template #default="{ row }">
              <span class="file-name-link" @click="handleFileNameClick(row)">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="segmentMode" label="分段模式" width="100">
            <template #default="{ row }">
              <el-tag size="small" effect="plain" round>通用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="charCount" label="字符数" width="100" />
          <el-table-column prop="recallCount" label="召回次数" width="100" />
          <el-table-column prop="uploadTime" label="上传时间" width="160" sortable />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <div class="status-cell">
                <div class="status-dot" :class="row.isEnabled ? 'active' : 'inactive'" />
                <span>{{ row.isEnabled ? '可用' : '已禁用' }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
              <div class="operation-cell">
                <el-switch
                  v-model="row.isEnabled"
                  inline-prompt
                  size="small"
                  @change="handleStatusChange(row)"
                />
                <el-dropdown trigger="click">
                  <el-button link type="primary">
                    <el-icon><More /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>重命名</el-dropdown-item>
                      <el-dropdown-item>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <!-- 批量操作工具栏 -->
        <div class="batch-toolbar" v-if="selectedRows.length > 0">
          <div class="selected-count">
            <span>已选择</span>
            <span class="count">{{ selectedRows.length }}</span>
            <span>项</span>
          </div>
          <div class="toolbar-actions">
            <el-button plain>
              <el-icon><Check /></el-icon>
              启用
            </el-button>
            <el-button plain>
              <el-icon><Close /></el-icon>
              禁用
            </el-button>
            <el-button plain @click="showBatchMetadataDialog = true">
              <el-icon><DataAnalysis /></el-icon>
              元数据
            </el-button>
            <el-button plain>
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button plain @click="handleCancelSelection">
              <el-icon><Link /></el-icon>
              取消
            </el-button>
          </div>
        </div>

        <!-- 底部分页器 -->
        <div class="pagination-container">
          <div class="pagination-left">
            <el-button-group>
              <el-button :disabled="true">
                <el-icon><ArrowLeft /></el-icon>
              </el-button>
              <el-button>
                <span>1/1</span>
              </el-button>
              <el-button :disabled="true">
                <el-icon><ArrowRight /></el-icon>
              </el-button>
            </el-button-group>
          </div>
          <div class="pagination-right">
            <span class="page-size-text">1</span>
            <el-dropdown trigger="click">
              <el-button>
                10
                <el-icon><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>10</el-dropdown-item>
                  <el-dropdown-item>25</el-dropdown-item>
                  <el-dropdown-item>50</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 设置页面 -->
      <KnowledgeSettingsView v-else-if="currentNav === 'settings'" />

      <!-- 历史记录页面 -->
      <div v-else-if="currentNav === 'history'" class="history-view">
        <!-- TODO: 实现历史记录页面 -->
      </div>
    </div>

    <!-- 元数据对话框 -->
    <el-dialog
      v-model="showMetadataDialog"
      title="元数据"
      width="480px"
      :close-on-click-modal="false"
      class="metadata-dialog"
    >
      <div class="metadata-content">
        <!-- 搜索框 -->
        <el-input
          v-model="metadataSearchQuery"
          placeholder="搜索元数据"
          class="metadata-search"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 元数据列表 -->
        <div class="metadata-list">
          <div class="metadata-item" v-for="item in filteredMetadata" :key="item.name">
            <div class="metadata-info">
              <span class="metadata-name">{{ item.name }}</span>
              <span class="metadata-type">{{ item.type }}</span>
            </div>
          </div>
        </div>

        <!-- 添加元数据按钮 -->
        <div class="metadata-actions">
          <el-button type="primary" @click="showNewMetadataDialog = true">
            <el-icon><Plus /></el-icon>
            新建元数据
          </el-button>
          <el-button @click="handleManageMetadata">
            <el-icon><Setting /></el-icon>
            管理
          </el-button>
        </div>

        <!-- 内置字段开关 -->
        <div class="built-in-fields">
          <div class="switch-label">
            <span>内置</span>
            <el-tooltip content="内置字段包含文档的基本属性" placement="top">
              <el-icon class="help-icon"><QuestionFilled /></el-icon>
            </el-tooltip>
          </div>
          <el-switch v-model="showBuiltInFields" />
        </div>

        <!-- 元数据字段列表 -->
        <div class="metadata-fields" v-if="showBuiltInFields">
          <div class="field-item" v-for="(field, index) in metadataFields" :key="field.name">
            <el-icon><component :is="field.icon" /></el-icon>
            <span class="field-name">{{ field.name }}</span>            
            <!-- 只对非内置字段显示操作按钮 -->
            <div v-if="!field.isBuiltIn" class="field-actions">
              <el-icon class="action-icon" @click="handleEditField(field)"><Edit /></el-icon>
              <el-icon class="action-icon" @click="handleDeleteField(index)"><Delete /></el-icon>
            </div>
            <span class="field-type">{{ field.type }}</span>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 新建元数据对话框 -->
    <el-dialog
      v-model="showNewMetadataDialog"
      title="新建元数据"
      width="480px"
      :close-on-click-modal="false"
      class="new-metadata-dialog"
    >
      <div class="new-metadata-content">
        <el-form :model="newMetadataForm" label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="newMetadataForm.name" placeholder="请输入元数据名称" />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="newMetadataForm.type" placeholder="请选择元数据类型" class="type-select">
              <el-option label="字符串" value="string" />
              <el-option label="数字" value="number" />
              <el-option label="布尔值" value="boolean" />
              <el-option label="日期" value="date" />
            </el-select>
          </el-form-item>
          <el-form-item label="描述">
            <el-input
              v-model="newMetadataForm.description"
              type="textarea"
              placeholder="请输入元数据描述"
              :rows="3"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showNewMetadataDialog = false">取消</el-button>
          <el-button type="primary" @click="handleCreateMetadata">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="showRenameDialog"
      title="重命名"
      width="400px"
      :close-on-click-modal="false"
      class="rename-dialog"
      :show-close="false"
    >
      <div class="rename-content">
        <div class="name-input">
          <div class="input-label">名称</div>
          <el-input v-model="renameField.name" placeholder="请输入新名称" />
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showRenameDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveRename">保存</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 批量编辑元数据对话框 -->
    <el-dialog
      v-model="showBatchMetadataDialog"
      title="编辑元数据"
      width="400px"
      :close-on-click-modal="false"
      class="batch-metadata-dialog"
    >
      <div class="batch-metadata-content">
        <div class="selected-files">
          <div class="label">编辑{{ selectedRows.length }}个文档</div>
        </div>

        <div class="metadata-list">
          <div class="add-metadata">
            <el-button link type="primary" @click="showAddMetadataDialog = true">
              <el-icon><Plus /></el-icon>
              添加元数据
            </el-button>
          </div>
        </div>

        <div class="apply-to-all">
          <el-checkbox v-model="applyToAll"></el-checkbox>
          <span>应用于所有选中文档</span>
          <el-tooltip content="自动。。。。TODO。。。" placement="top">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showBatchMetadataDialog = false">取消</el-button>
          <el-button type="primary" @click="handleSaveBatchMetadata">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Search,
  Plus,
  More,
  RefreshRight,
  ArrowLeft,
  ArrowRight,
  ArrowDown,
  Document,
  Timer,
  Setting,
  QuestionFilled,
  User,
  Link,
  Edit,
  Delete,
  Check,
  Close,
  DataAnalysis
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import KnowledgeSettingsView from './KnowledgeSettingsView.vue'
import KnowledgeLableView from './KnowledgeLableView.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 当前选中的导航项
const currentNav = ref('doc')

// 元数据对话框显示状态
const showMetadataDialog = ref(false)
const showBuiltInFields = ref(true)
const showNewMetadataDialog = ref(false)

// 元数据字段列表
const metadataFields = ref([
  { name: 'document_name', type: 'string', icon: 'Document', isBuiltIn: true },
  { name: 'uploader', type: 'string', icon: 'User', isBuiltIn: true },
  { name: 'upload_date', type: 'time', icon: 'Timer', isBuiltIn: true },
  { name: 'last_update_date', type: 'time', icon: 'Timer', isBuiltIn: true },
  { name: 'source', type: 'string', icon: 'Link', isBuiltIn: true }
])

// 新建元数据表单
const newMetadata = ref({
  type: 'String',
  name: ''
})

// 重命名相关状态
const showRenameDialog = ref(false)
const renameField = ref({
  index: -1,
  name: ''
})

// 导航切换处理
const switchNav = (nav) => {
  currentNav.value = nav
}

// 搜索关键词
const searchQuery = ref('')

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '4b0f3ef2-674c-4ab7-b7bf-3ae73d0ba628.pptx',
    segmentMode: 'general',
    charCount: '531',
    recallCount: '0',
    uploadTime: '2025-03-25 02:18',
    status: 'active',
    isEnabled: true
  },
  {
    id: 2,
    name: '3-大模型基石-transformer (1).pdf',
    segmentMode: 'general',
    charCount: '1.9k',
    recallCount: '0',
    uploadTime: '2025-03-25 01:50',
    status: 'active',
    isEnabled: true
  }
])

// 过滤后的表格数据
const filteredTableData = computed(() => {
  if (!searchQuery.value) return tableData.value
  const query = searchQuery.value.toLowerCase()
  return tableData.value.filter(item => 
    item.name.toLowerCase().includes(query)
  )
})

// 选中的行数据
const selectedRows = ref([])

// 表格实例引用
const tableRef = ref(null)

// 处理表格选择变化
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

// 处理状态变化
const handleStatusChange = (row) => {
  row.status = row.isEnabled ? 'active' : 'inactive'
}

// 处理添加文件
const handleAddFile = () => {
  router.push({
    path: '/knowledge/create',
    query: { mode: 'empty' }
  })
}

// 处理文件名点击
const handleFileNameClick = (row) => {
  router.push({
    path: '/knowledge/label',
    query: { id: row.id }
  })
}

// 处理返回按钮点击
const handleBack = () => {
  showNewMetadataDialog.value = false
  newMetadata.value = {
    type: 'String',
    name: ''
  }
}

// 处理编辑字段
const handleEditField = (field) => {
  const index = metadataFields.value.findIndex(f => f.name === field.name)
  renameField.value = {
    index,
    name: field.name
  }
  showRenameDialog.value = true
}

// 处理删除字段
const handleDeleteField = (index) => {
  ElMessageBox.confirm(
    '确认删除该元数据字段？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    metadataFields.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 处理保存重命名
const handleSaveRename = () => {
  if (!renameField.value.name) {
    ElMessage.warning('请输入新名称')
    return
  }

  if (renameField.value.index > -1) {
    metadataFields.value[renameField.value.index].name = renameField.value.name
    ElMessage.success('重命名成功')
    showRenameDialog.value = false
  }
}

// 处理保存元数据
const handleSaveMetadata = () => {
  if (!newMetadata.value.name) {
    ElMessage.warning('请输入元数据名称')
    return
  }

  // 添加新的元数据字段
  metadataFields.value.push({
    name: newMetadata.value.name,
    type: newMetadata.value.type.toLowerCase(),
    icon: 'Document',
    isBuiltIn: false
  })

  ElMessage.success('元数据添加成功')
  handleBack()
}

// 批量编辑元数据对话框显示状态
const showBatchMetadataDialog = ref(false)

// 新增添加元数据对话框显示状态
const showAddMetadataDialog = ref(false)

// 新增应用于所有选中文档复选框状态
const applyToAll = ref(false)

// 处理保存添加的元数据
const handleSaveAddedMetadata = () => {
  // TODO: 实现保存添加的元数据的逻辑
  showAddMetadataDialog.value = false
  ElMessage.success('元数据添加成功')
}

// ... existing code ...
</script>

<style scoped>
.page-container {
  display: flex;
  height: 100%;
  background-color: var(--el-bg-color);
}

.file-name-link {
  color: var(--el-color-primary);
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
}

.side-nav {
  width: 48px;
  background-color: var(--el-bg-color);
  border-right: 1px solid var(--el-border-color-lighter);
  padding: 16px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.nav-item {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  color: var(--el-text-color-secondary);
  transition: all 0.3s;

  &:hover {
    background-color: var(--el-fill-color-light);
    color: var(--el-color-primary);
  }

  &.active {
    background-color: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
  }

  .el-icon {
    font-size: 18px;
  }
}

.main-container {
  flex: 1;
  overflow: auto;
}

.doc-list {
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.page-title {
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.search-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  .search-input {
    width: 240px;

    :deep(.el-input__wrapper) {
      padding-left: 8px;
    }

    :deep(.el-input__prefix) {
      font-size: 16px;
    }
  }

  .right-buttons {
    display: flex;
    gap: 8px;
  }
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  
  .el-table__header th {
    font-weight: 500;
    color: var(--el-text-color-primary);
  }
}

.status-cell {
  display: flex;
  align-items: center;
  gap: 8px;

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;

    &.active {
      background-color: var(--el-color-success);
    }

    &.inactive {
      background-color: var(--el-color-danger);
    }
  }
}

.operation-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.pagination-left {
  .el-button-group {
    .el-button {
      padding: 8px 12px;
    }
  }
}

.pagination-right {
  display: flex;
  align-items: center;
  gap: 8px;

  .page-size-text {
    color: var(--el-text-color-secondary);
    font-size: 14px;
  }

  .el-button {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.metadata-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }
}

.metadata-content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .metadata-search {
    margin-bottom: 16px;
  }

  .metadata-list {
    margin-bottom: 16px;
    max-height: 300px;
    overflow-y: auto;

    .metadata-item {
      padding: 12px;
      border-radius: 4px;
      background-color: var(--el-fill-color-light);
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }

      .metadata-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .metadata-name {
          font-size: 14px;
          color: var(--el-text-color-primary);
        }

        .metadata-type {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          background-color: var(--el-fill-color);
          padding: 2px 8px;
          border-radius: 10px;
        }
      }
    }
  }

  .metadata-actions {
    display: flex;
    gap: 8px;

    .el-button {
      flex: 1;
    }
  }
}

.new-metadata-dialog {
  .new-metadata-content {
    .el-form {
      .type-select {
        width: 100%;
      }
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
}

.built-in-fields {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .switch-label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--el-text-color-primary);

    .help-icon {
      font-size: 14px;
      color: var(--el-text-color-secondary);
      cursor: help;
    }
  }
}

.metadata-fields {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;

  .el-icon {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }

  .field-name {
    flex: 1;
    font-size: 14px;
    color: var(--el-text-color-primary);
  }

  .field-type {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    background-color: var(--el-fill-color-light);
    padding: 2px 6px;
    border-radius: 4px;
    margin-right: 8px;
  }

  .field-actions {
    display: flex;
    gap: 8px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &:hover .field-actions {
    opacity: 1;
  }

  .action-icon {
    font-size: 16px;
    color: var(--el-text-color-secondary);
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }
}

.new-metadata-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.new-metadata-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.type-selector {
  display: flex;
  justify-content: center;
}

.name-input {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .input-label {
    font-size: 14px;
    color: var(--el-text-color-primary);
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.rename-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.rename-content {
  .name-input {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .input-label {
      font-size: 14px;
      color: var(--el-text-color-primary);
    }
  }
}

.batch-toolbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;

  .selected-count {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--el-text-color-regular);

    .count {
      color: var(--el-color-primary);
      font-weight: 500;
    }
  }

  .toolbar-actions {
    display: flex;
    align-items: center;
    gap: 8px;
    border-left: 1px solid var(--el-border-color-lighter);
    padding-left: 16px;

    .el-button {
      display: flex;
      align-items: center;
      gap: 4px;
    }
  }
}

.batch-metadata-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    padding: 16px 20px;
    border-top: 1px solid var(--el-border-color-lighter);
  }
}

.batch-metadata-content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .selected-files {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .label {
      font-size: 14px;
      color: var(--el-text-color-regular);
    }

    .file-name {
      font-size: 14px;
      color: var(--el-text-color-primary);
      background-color: var(--el-fill-color-light);
      padding: 8px 12px;
      border-radius: 4px;
    }
  }

  .metadata-list {
    min-height: 50px;
    border: 1px dashed var(--el-border-color);
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;

    .add-metadata {
      .el-button {
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }

  .apply-to-all {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--el-text-color-regular);

    .el-icon {
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>