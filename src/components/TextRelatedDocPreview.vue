<template>
  <div class="file-content">
    <template v-if="content">
      <div class="content-preview" :class="{ 'markdown-content': isMarkdown }">
        <div v-if="isMarkdown" v-html="renderedContent"></div>
        <div v-else>{{ content }}</div>
      </div>
    </template>
    <template v-else>
      <div class="empty-content">
        <p>文件预览区域</p>
      </div>
    </template>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-overlay">
      <el-icon class="loading-icon" :size="24"><Loading /></el-icon>
      <p>正在加载文件内容...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { marked } from 'marked'
import { Loading } from '@element-plus/icons-vue'
import mammoth from 'mammoth'
import * as pdfjsLib from 'pdfjs-dist'
import * as XLSX from 'xlsx'

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const props = defineProps({
  file: {
    type: Object,
    default: null
  }
})

const content = ref('')
const loading = ref(false)

// 判断是否为 Markdown 文件
const isMarkdown = computed(() => {
  if (!props.file) return false
  const fileName = props.file.name.toLowerCase()
  return fileName.endsWith('.md') || fileName.endsWith('.markdown')
})

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!isMarkdown.value || !content.value) return ''
  return marked(content.value)
})

// 处理文本文件
const handleTextFile = async (file) => {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

// 处理 Word 文件
const handleWordFile = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

// 处理 Excel 文件
const handleExcelFile = async (file) => {
  try {
    const buffer = await file.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: 'array' })
    
    let result = []
    
    // 遍历所有工作表
    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      
      // 将工作表转换为JSON格式，设置header为1表示使用第一行作为标题
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '', // 设置空单元格的默认值
      })
      
      // 过滤掉完全为空的行
      const filteredData = jsonData.filter(row => 
        row.some(cell => cell !== '')
      )
      
      if (filteredData.length > 0) {
        // 添加工作表名称和数据到结果中
        result.push(`Sheet: ${sheetName}`)
        result.push('')  // 空行作为分隔
        
        // 格式化并添加每行数据
        filteredData.forEach(row => {
          result.push(row.join('\t'))
        })
        
        result.push('')  // 在不同工作表之间添加空行
        result.push('')
      }
    }
    
    if (result.length === 0) {
      return '文件内容为空'
    }
    
    return result.join('\n')
  } catch (error) {
    console.error('Excel文件处理错误:', error)
    throw new Error('Excel文件处理失败，请检查文件格式是否正确')
  }
}

// 处理 PDF 文件
const handlePdfFile = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
    const pdf = await loadingTask.promise
    
    let fullText = []
    const totalPages = pdf.numPages

    // 使用 Promise.all 并行处理所有页面
    const pagePromises = []
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      pagePromises.push(
        pdf.getPage(pageNum).then(async (page) => {
          const textContent = await page.getTextContent()
          return {
            pageNum,
            text: textContent.items
              .map(item => item.str)
              .join(' ')
          }
        })
      )
    }

    // 等待所有页面处理完成
    const pages = await Promise.all(pagePromises)
    
    // 按页码排序并合并文本
    pages.sort((a, b) => a.pageNum - b.pageNum)
    fullText = pages.map(page => `第 ${page.pageNum} 页\n${page.text}\n`).join('\n')
    
    return fullText
  } catch (error) {
    console.error('PDF processing error:', error)
    throw new Error('PDF 文件处理失败')
  }
}

// 监听文件变化并处理预览
watch(() => props.file, async (newFile) => {
  if (!newFile) {
    content.value = ''
    return
  }

  loading.value = true
  try {
    const fileName = newFile.name.toLowerCase()
    const fileType = newFile.type.toLowerCase()

    // 根据文件类型选择处理方法
    if (fileType.startsWith('text/') || isMarkdown.value) {
      content.value = await handleTextFile(newFile)
    } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
      content.value = await handleWordFile(newFile)
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      content.value = await handleExcelFile(newFile)
    } else if (fileName.endsWith('.pdf')) {
      try {
        content.value = await handlePdfFile(newFile)
      } catch (error) {
        console.error('PDF preview error:', error)
        content.value = 'PDF 文件预览失败：' + error.message
      }
    } else {
      content.value = '该文件类型暂不支持预览'
    }
  } catch (error) {
    console.error('Error reading file:', error)
    content.value = '无法预览文件内容：' + error.message
  } finally {
    loading.value = false
  }
}, { immediate: true })
</script>

<style scoped>
.file-content {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background-color: var(--el-bg-color);
  position: relative;
}

.content-preview {
  font-family: monospace;
  white-space: pre-wrap;
  font-size: 12px;
  line-height: 1.5;
}

.markdown-content {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  white-space: normal;

  :deep(h1) {
    font-size: 1.5em;
    margin: 0.5em 0;
  }

  :deep(h2) {
    font-size: 1.3em;
    margin: 0.4em 0;
  }

  :deep(p) {
    margin: 0.5em 0;
  }

  :deep(code) {
    background-color: var(--el-fill-color-light);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: monospace;
  }

  :deep(pre) {
    background-color: var(--el-fill-color-light);
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
  }
}

.empty-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  font-size: 12px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;

  .loading-icon {
    animation: rotate 1s linear infinite;
  }

  p {
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 