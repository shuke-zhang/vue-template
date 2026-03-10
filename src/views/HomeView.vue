<script setup lang="ts">
import { NAutoComplete, NButton, NInput, NTooltip } from 'naive-ui'
import { getCodeImg } from '@/api/login'
import { getSerialize } from '@/api/serialize'
import router from '@/router'
import { removeAllPending } from '@/utils/request'

const codeImg = ref<string>('')
const codeUUid = ref<string>('')
const loading = ref(false)
const inputValue = ref('sys_sss')
const inputRef = useTemplateRef('inputRef')
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

function handleGetSerialize() {
  return getSerialize([1, 2, 3]).then(() => {
    console.log('操作成功')
  })
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
    <div
      class="flex flex-col space-y-2 p-4 w-64 bg-gray-50 border-r border-gray-200"
    >
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

      <el-button
        type="primary"
        :loading="loading"
        @click="router.push('/doubao')"
      >
        跳转豆包
      </el-button>

      <el-button
        type="primary"
        :loading="loading"
        @click="router.push('/logs')"
      >
        跳转日志
      </el-button>

      <el-button type="primary" :loading="loading" @click="handleGetSerialize">
        请求序列化
      </el-button>

      <icon-font name="close" color="#b3b3b7" />
      <icon-font name="loop" size="64" color="red" />
      <icon-font name="loop" size="128" color="green" />
      <icon-font name="close" color="red" />
    </div>
    <!-- 右侧内容区，可展示验证码图片等 -->
    <div class="flex-1 flex flex-col items-center justify-center">
      <div v-if="codeImg">
        <img :src="codeImg" alt="验证码">

        <div class="mt-2 text-center text-gray-500 text-xs">
          UUID: {{ codeUUid }}
        </div>
      </div>

      <NAutoComplete v-model:value="inputValue">
        <template #default="{ handleInput, handleBlur, handleFocus }">
          <NInput
            ref="inputRef"
            v-model:value="inputValue"
            type="textarea"
            placeholder="请输入"
            rows="3"
            :autosize="{ minRows: 3, maxRows: 5 }"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur"
          >
            <template #suffix>
              <div class="relative; w-[40px]">
                <div class="absolute bottom-[-3px] right-[0px]">
                  <NButton type="primary">
                    <template #icon>
                      <span class="dark:text-black">
                        <icon-font name="loop" size="12" color="red" />
                      </span>
                    </template>
                  </NButton>
                </div>
              </div>
            </template>
          </NInput>
        </template>
      </NAutoComplete>
    </div>

    <!-- <div>
      <el-input v-model="inputValue" placeholder="请输入内容" />
    </div> -->

    <!-- <Pagination
      v-model:page-size="size"
      v-model:page-num="page"
      :total="500"
    /> -->
  </div>
</template>

<style scoped>
.el-button + .el-button {
  margin-left: 0;
}
</style>
