<template>
  <div class="home">
    <div class="section">
      <h2 class="section-title">创建应用</h2>
      <div class="card-list">
        <el-card class="action-card" shadow="hover" @click="showCreateDialog">
          <div class="card-content">
            <el-icon class="icon"><Plus /></el-icon>
            <span>创建空白应用</span>
          </div>
        </el-card>
        <el-card class="action-card" shadow="hover" @click="showTemplateDialog">
          <div class="card-content">
            <el-icon class="icon"><Upload /></el-icon>
            <span>从历史模板创建</span>
          </div>
        </el-card>
        <el-card class="action-card" shadow="hover">
          <div class="card-content">
            <el-icon class="icon"><Document /></el-icon>
            <span>导入DSL文件</span>
          </div>
        </el-card>
      </div>
    </div>

    <div class="section">
      <h2 class="section-title">最近使用</h2>
      <div class="card-list">
        <el-card v-for="app in appList" :key="app.id" class="app-card" shadow="hover" @click="handleEditInfo(app)">
          <div class="app-info">
            <el-avatar :size="40" :src="app.avatar || 'https://avatars.githubusercontent.com/u/1?v=4'" />
            <div class="app-details">
              <h3>{{ app.name }}</h3>
              <p>{{ app.mode }}</p>
            </div>
            <el-dropdown trigger="click" class="more-actions" @click.stop>
              <el-button type="text" class="more-btn">
                <el-icon><More /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleEditInfo">
                    <el-icon><Edit /></el-icon>
                    <span>编辑信息</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleCopy">
                    <el-icon><Document /></el-icon>
                    <span>复制</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleExportDSL">
                    <el-icon><Document /></el-icon>
                    <span>导出 DSL</span>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleOpenInExplorer">
                    <el-icon><Document /></el-icon>
                    <span>在"探索"中打开</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="handleDelete" class="danger">
                    <el-icon><Delete /></el-icon>
                    <span>删除</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 创建应用弹窗 -->
    <CreateAppDialog
      v-model:visible="createDialogVisible"
      @create="handleCreateApp"
    />

    <!-- 模板选择弹窗 -->
    <TemplateDialog
      v-model:visible="templateDialogVisible"
      @create="handleCreateFromTemplate"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Plus,
  Upload,
  Document,
  More,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import CreateAppDialog from '../components/CreateAppDialog.vue'
import TemplateDialog from '../components/TemplateDialog.vue'
import { ElMessage } from 'element-plus'
import { listApps } from '@/api/apps'

const router = useRouter()
const createDialogVisible = ref(false)
const templateDialogVisible = ref(false)
const appList = ref([])

const showCreateDialog = () => {
  createDialogVisible.value = true
}

const showTemplateDialog = () => {
  templateDialogVisible.value = true
}

const handleCreateApp = (appData) => {
  console.log('创建应用:', appData)
  ElMessage.success('应用创建成功')
  // TODO: 处理应用创建逻辑
}

const handleCreateFromTemplate = (template) => {
  console.log('从模板创建:', template)
  ElMessage.success('应用创建成功')
  // TODO: 处理从模板创建的逻辑
}

// 处理更多操作
const handleEditInfo = (app) => {
  console.log('编辑应用信息:', app)
  if (!app || !app.id) {
    ElMessage.warning('应用信息不完整')
    return
  }
  // 跳转到编辑页面
  router.push({
    path: '/chat-assistant/create',
    query: { id: app.id }
  })
}

const handleCopy = () => {
  // 实现复制逻辑
  console.log('复制应用')
}

const handleExportDSL = () => {
  // 实现导出 DSL 逻辑
  console.log('导出应用 DSL')
}

const handleOpenInExplorer = () => {
  // 实现在探索中打开逻辑
  console.log('在探索中打开应用')
}

const handleDelete = () => {
  // 实现删除逻辑
  console.log('删除应用')
}

// 获取应用列表
const fetchAppList = async () => {
  try {
    const data = await listApps()
    if (Array.isArray(data)) {
      appList.value = data
    } else if (data && Array.isArray(data.content)) {
      appList.value = data.content
    } else {
      appList.value = []
      ElMessage.warning('获取应用列表数据格式异常')
    }
  } catch (error) {
    ElMessage.error('获取应用列表失败：' + error.message)
  }
}

onMounted(() => {
  fetchAppList()
})
</script>

<style scoped>
.home {
  padding: 20px;
}

.section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 20px;
  color: #333;
}

.card-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 20px;
}

.action-card {
  cursor: pointer;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 10px;
}

.icon {
  font-size: 24px;
  color: #409EFF;
}

.app-card {
  cursor: pointer;
  position: relative;
}

.app-info {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
}

.app-details h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.app-details p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #666;
}

.more-actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
}

.more-btn {
  padding: 8px;
  color: #909399;
  
  &:hover {
    color: #409eff;
  }
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  
  .el-icon {
    margin-right: 4px;
  }
}

:deep(.el-dropdown-menu__item.danger) {
  color: #f56c6c;
  
  &:hover {
    background-color: #fef0f0;
  }
}
</style>