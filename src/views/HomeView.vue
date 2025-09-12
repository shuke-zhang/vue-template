<script setup lang="ts">
import { getCodeImg } from '@/api/login'
import router from '@/router'
import { removeAllPending } from '@/utils/request'

const codeImg = ref<string>('')
const codeUUid = ref<string>('')
const loading = ref(false)
const inputValue = ref('sys_sss')
function handleGetCodeImg() {
  return getCodeImg().then((res) => {
    codeImg.value = `data:image/png;base64,${res.img}`
    codeUUid.value = res.uuid
  })
}

async function handleMultiRequest() {
  const count = 10
  const interval = 300

  for (let i = 0; i < count; i++) {
    // 每次立即触发请求，不 await
    getCodeImg(true)

    // 等待 200ms 再触发下一次
    await new Promise(resolve => setTimeout(resolve, interval))
  }
}

function handleCancelRequests() {
  removeAllPending()
}

function handleMsg() {
  showMessageError('提示')
}
const size = ref(1)
const page = ref(10)
</script>

<template>
  <div class="flex h-screen">
    <!-- 左侧按钮区 -->
    <div class="flex flex-col space-y-2 p-4 w-64 bg-gray-50 border-r border-gray-200">
      <el-button type="primary" :loading="loading" @click="handleGetCodeImg">
        获取验证码
      </el-button>
      <el-button type="primary" :loading="loading" @click="handleMultiRequest">
        点击发送10次请求
      </el-button>
      <el-button type="danger" @click="handleCancelRequests">
        点击取消之前的请求
      </el-button>

      <el-button type="danger" @click="router.push('/login')">
        跳转到登录页
      </el-button>

      <el-button type="primary" :loading="loading" @click="handleMsg">
        测试信息提示
      </el-button>

      <el-button type="primary" :loading="loading" @click="router.push('/doubao')">
        跳转豆包
      </el-button>
    </div>
    <!-- 右侧内容区，可展示验证码图片等 -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <div v-if="codeImg">
        <img :src="codeImg" alt="验证码">
        <div class="mt-2 text-center text-gray-500 text-xs">
          UUID: {{ codeUUid }}
        </div>
      </div>
    </div>

    <div>
      <el-input v-model="inputValue" placeholder="请输入内容" />
    </div>

    <Pagination
      v-model:page-size="size"
      v-model:page-num="page"
      :total="500"
    />
  </div>
</template>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}
</style>
