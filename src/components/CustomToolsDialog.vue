<template>
  <el-dialog
    v-model="dialogVisible"
    title="创建自定义工具"
    width="600px"
    :before-close="handleClose"
    class="custom-tools-dialog"
  >
    <div class="dialog-content">
      <!-- 名称输入 -->
      <div class="form-item">
        <div class="form-label">
          <span class="required">*</span>
          名称
        </div>
        <div class="form-input">
          <div class="name-input-wrapper">
            <el-input v-model="formData.name" placeholder="输入工具名称" />
          </div>
        </div>
      </div>

      <!-- Schema 输入 -->
      <div class="form-item">
        <div class="form-label">
          <span class="required">*</span>
          Schema
        </div>
        <div class="form-input">
          <div class="schema-actions">
            <div class="schema-link">
              <el-link type="primary" :underline="false" href="#" target="_blank">
                查看 OpenAPI-Swagger 规范
                <el-icon class="external-link"><ArrowRight /></el-icon>
              </el-link>
            </div>
            <div class="schema-buttons">
              <el-button>
                <el-icon><Plus /></el-icon>
                从 URL 导入
              </el-button>
              <el-dropdown trigger="click">
                <el-button>
                  例子
                  <el-icon class="el-icon--right"><ArrowDown /></el-icon>
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>示例 1</el-dropdown-item>
                    <el-dropdown-item>示例 2</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </div>
          <el-input
            v-model="formData.schema"
            type="textarea"
            :rows="8"
            placeholder="在此处输入您的 OpenAPI schema"
            resize="none"
          />
        </div>
      </div>

      <!-- 可用工具表格 -->
      <div class="form-item">
        <div class="form-label">可用工具</div>
        <div class="form-table">
          <el-table :data="availableTools" style="width: 100%">
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="method" label="方法" />
            <el-table-column prop="path" label="路径" />
            <el-table-column label="操作" width="80">
              <template #default="scope">
                <el-button type="primary" link>
                  <el-icon><Setting /></el-icon>
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <!-- 标签选择 -->
      <div class="form-item">
        <div class="form-label">标签</div>
        <div class="form-input">
          <MultiSelectDropdown
            v-model="formData.tags"
            :options="availableTags"
            placeholder="选择标签（可选）"
          />
        </div>
      </div>

      <!-- 隐私协议 -->
      <div class="form-item">
        <div class="form-label">隐私协议</div>
        <div class="form-input">
          <el-input
            v-model="formData.privacy"
            type="textarea"
            :rows="1"
            placeholder="请输入隐私协议"
            resize="none"
          />
        </div>
      </div>

      <!-- 自定义免责声明 -->
      <div class="form-item">
        <div class="form-label">自定义免责声明</div>
        <div class="form-input">
          <el-input
            v-model="formData.disclaimer"
            type="textarea"
            :rows="1"
            placeholder="请输入自定义免责声明"
            resize="none"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { ArrowRight, ArrowDown, Plus, Setting } from '@element-plus/icons-vue'
import MultiSelectDropdown from './MultiSelectDropdown.vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'save'])

const dialogVisible = ref(props.visible)

// 添加 watch 来同步 props.visible 和 dialogVisible
watch(() => props.visible, (newVal) => {
  dialogVisible.value = newVal
})

// 添加 watch 来同步 dialogVisible 和 props.visible
watch(() => dialogVisible.value, (newVal) => {
  emit('update:visible', newVal)
})

// 表单数据
const formData = ref({
  name: '',
  schema: '',
  tags: [],
  privacy: '',
  disclaimer: ''
})

// 可用工具数据
const availableTools = ref([])

// 可选标签
const availableTags = ref([
  '插件',
  '代码',
  '数据库',
  'API'
])

// 处理关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 处理保存
const handleSave = () => {
  // TODO: 验证表单数据
  emit('save', formData.value)
  handleClose()
}
</script>

<style scoped>
.custom-tools-dialog {
  :deep(.el-dialog__header) {
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid #e4e7ed;
  }

  :deep(.el-dialog__body) {
    padding: 20px;
  }

  :deep(.el-dialog__footer) {
    padding: 20px;
    border-top: 1px solid #e4e7ed;
  }
}

.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item {
  display: flex;
  gap: 16px;
}

.form-label {
  width: 100px;
  flex-shrink: 0;
  font-size: 14px;
  color: #303133;
  display: flex;
  align-items: flex-start;
  gap: 4px;

  .required {
    color: #f56c6c;
  }

  .el-link {
    margin-left: auto;
    font-size: 12px;
  }

  .external-link {
    font-size: 12px;
  }
}

.form-input {
  flex: 1;
  min-width: 0;
}

.name-input-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tool-avatar {
  flex-shrink: 0;
}

.schema-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.schema-link {
  flex-shrink: 0;
}

.schema-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.external-link {
  font-size: 12px;
  margin-left: 4px;
}

.form-table {
  flex: 1;
  min-width: 0;
}

:deep(.el-table) {
  --el-table-border-color: #e4e7ed;
  --el-table-header-bg-color: #f5f7fa;
}
</style> 