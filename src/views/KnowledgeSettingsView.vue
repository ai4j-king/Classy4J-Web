<template>
  <div class="settings-container">
    <h2 class="settings-title">知识库设置</h2>
    <p class="settings-desc">在这里，您可以修改此知识库的属性和检索设置</p>

    <div class="settings-form">
      <!-- 知识库名称 -->
      <div class="form-item">
        <div class="form-label">知识库名称</div>
        <el-input v-model="formData.name" placeholder="新的知识库" />
      </div>

      <!-- 知识库描述 -->
      <div class="form-item">
        <div class="form-label">知识库描述</div>
        <el-input
          v-model="formData.description"
          type="textarea"
          :rows="4"
          placeholder="描述该数据集的内容。详细描述可以让 AI 更好地访问数据集的内容。如果为空，LangGenius 将使用默认的命中策略。"
        />
      </div>

      <!-- 可见权限 -->
      <div class="form-item">
        <div class="form-label">可见权限</div>
        <el-select v-model="formData.visibility" class="visibility-select">
          <el-option
            v-for="item in visibilityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
            {{ item.label }}
          </el-option>
        </el-select>
      </div>

      <!-- 索引模式 -->
      <div class="form-item">
        <div class="form-label">索引模式</div>
        <div class="index-mode-options">
          <!-- 高质量选项 -->
          <div 
            class="mode-option" 
            :class="{ active: formData.indexMode === 'high' }"
            @click="formData.indexMode = 'high'"
          >
            <div class="mode-header">
              <el-icon class="quality-icon"><Star /></el-icon>
              <span>高质量</span>
              <el-tag size="small" type="success" class="recommend-tag">推荐</el-tag>
            </div>
            <p class="mode-desc">调用嵌入模型来处理文档以实现更精确的检索，可以帮助大语言模型生成高质量的回答。</p>
          </div>

          <!-- 经济选项 -->
          <div 
            class="mode-option" 
            :class="{ active: formData.indexMode === 'economic' }"
            @click="formData.indexMode = 'economic'"
          >
            <div class="mode-header">
              <el-icon class="economy-icon"><Money /></el-icon>
              <span>经济</span>
            </div>
            <p class="mode-desc">每个块使用 10 个关键词进行检索，不消耗 tokens，但会降低检索准确性。</p>
          </div>
        </div>
      </div>

      <!-- 检索设置 -->
      <div class="form-item">
        <div class="form-label">检索设置</div>
        <div class="search-settings">
          <div class="setting-option active">
            <el-icon><Grid /></el-icon>
            <div class="option-content">
              <div class="option-title">倒排索引</div>
              <div class="option-desc">倒排索引是一种用于高效检索的结构。按关键词组织，每个本语指向包含它的文档或网页</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Top K 设置 -->
      <div class="form-item">
        <div class="form-label">
          Top K
          <el-tooltip content="检索时返回相似度最高的前 K 个结果">
            <el-icon class="help-icon"><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
        <el-input-number v-model="formData.topK" :min="1" :max="10" />
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="form-actions">
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  UserFilled,
  Star,
  Money,
  Grid,
  QuestionFilled
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const formData = ref({
  name: '',
  description: '',
  visibility: 'private',
  indexMode: 'high',
  topK: 2
})

const visibilityOptions = [
  {
    label: '只有我',
    value: 'private'
  }
]

const handleSave = () => {
  // TODO: 实现保存逻辑
  ElMessage.success('设置已保存')
}
</script>

<style scoped>
.settings-container {
  padding: 24px;
  max-width: 800px;
}

.settings-title {
  margin: 0;
  font-size: 20px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.settings-desc {
  margin: 8px 0 24px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  display: flex;
  align-items: center;
  gap: 4px;

  .help-icon {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    cursor: help;
  }
}

.visibility-select {
  width: 200px;
}

.index-mode-options {
  display: flex;
  gap: 16px;
}

.mode-option {
  flex: 1;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }
}

.mode-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-weight: 500;

  .quality-icon {
    color: var(--el-color-warning);
  }

  .economy-icon {
    color: var(--el-color-success);
  }

  .recommend-tag {
    margin-left: auto;
  }
}

.mode-desc {
  margin: 0;
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.search-settings {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.setting-option {
  display: flex;
  gap: 12px;
  padding: 16px;
  border: 1px solid var(--el-border-color);
  border-radius: 8px;
  transition: all 0.3s;

  &.active {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
  }

  .el-icon {
    font-size: 24px;
    color: var(--el-color-primary);
  }
}

.option-content {
  flex: 1;
}

.option-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
}

.form-actions {
  margin-top: 32px;
}
</style> 