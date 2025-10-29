<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

// 你的后端地址（注意：要和 Node 服务端口匹配）
const BASE_URL = 'http://180.184.29.82:3099/api'

const inputText = ref('')
const logs = ref<{ timestamp: string, payload: any }[]>([])

/** 写入日志 */
async function writeLog() {
  try {
    if (!inputText.value.trim()) {
      ElMessage.warning('请输入要写入的 JSON 内容')
      return
    }
    const parsed = JSON.parse(inputText.value)
    const res = await axios.post(`${BASE_URL}/write`, parsed)
    if (res.data.success) {
      ElMessage.success('写入成功')
      await readLog()
      inputText.value = ''
    }
  }
  catch (err: any) {
    ElMessage.error(`写入失败: ${err.message}`)
  }
}

/** 读取日志 */
async function readLog() {
  try {
    const res = await axios.get(`${BASE_URL}/read`)
    if (res.data.success) {
      logs.value = res.data.records.reverse() // 最新在上
    }
    else {
      logs.value = []
    }
  }
  catch (err: any) {
    ElMessage.error(`读取失败: ${err.message}`)
  }
}

/** 清空日志 */
async function clearLog() {
  try {
    await axios.delete(`${BASE_URL}/clear`)
    logs.value = []
    ElMessage.success('日志已清空')
  }
  catch (err: any) {
    ElMessage.error(`清空失败: ${err.message}`)
  }
}

// 页面加载时读取一次
readLog()
</script>

<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">
      📘 日志管理中心2
    </h2>

    <!-- 写入日志 -->
    <div class="mb-6 space-y-2">
      <h3 class="text-lg font-semibold">
        写入日志
      </h3>
      <el-input
        v-model="inputText"
        type="textarea"
        :rows="4"
        placeholder="请输入要写入的 JSON 数据"
      />
      <el-button type="primary" @click="writeLog">
        写入日志
      </el-button>
    </div>

    <!-- 日志内容 -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          日志内容
        </h3>
        <div class="space-x-2">
          <el-button type="success" @click="readLog">
            刷新日志
          </el-button>
          <el-button type="danger" @click="clearLog">
            清空日志
          </el-button>
        </div>
      </div>

      <el-table
        v-if="logs.length > 0"
        :data="logs"
        style="width: 100%; margin-top: 10px;"
      >
        <el-table-column prop="timestamp" label="时间戳" width="220" />
        <el-table-column label="内容">
          <template #default="{ row }">
            <pre>{{ JSON.stringify(row.payload, null, 2) }}</pre>
          </template>
        </el-table-column>
      </el-table>

      <p v-else class="text-gray-400 mt-4">
        暂无日志记录
      </p>
    </div>
  </div>
</template>

<style scoped>
pre {
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  color: #333;
}
</style>
