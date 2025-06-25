<script setup lang="ts">
import type { FormInstance } from 'element-plus';
import { getCodeImg } from '@/api/login';

const router = useRouter();
const codeForm = ref({
  img: '',
  code: '',
  uuid: '',
});
const form = ref({
  username: __DEV__ ? 'vben' : '',
  password: __DEV__ ? '123456' : '',
  captcha: true,
  selectAccount: 'vben',
});
const userStore = useUserStore();
const loading = ref(false);
const formRef = ref<FormInstance>();
/**
 * 获取验证码
 */
function handleGetCodeImg() {
  return getCodeImg().then((res) => {
    codeForm.value = {
      img: res.img,
      uuid: res.uuid,
      code: '',
    };
  });
}
/**
 * 登录
 */
function handleLogin() {
  formRef.value?.validate().then(() => {
    loading.value = true;
    userStore
      .login({
        username: form.value.username,
        password: form.value.password,
        code: codeForm.value.code,
        uuid: codeForm.value.uuid,
      })
      .then(() => {
        console.log('登录成功');

        router.replace('/');
      })
      .finally(() => {
        loading.value = false;
      });
  });
}
onMounted(() => {
  handleGetCodeImg();
});
</script>

<template>
  <div class="h-[100vh] flex justify-center items-center flex-direction-column login-page">
    <el-card :body-style="{ padding: '40px' }" class="card">
      <div class="login ">
        <el-form ref="formRef" :model="form">
          <el-form-item prop="username" :rules="[{ required: true, message: '用户名不能为空' }]">
            <el-input
              v-model="form.username"
              type="text"
              placeholder="用户名"
              @keydown.enter="handleLogin"
            >
              <template #prefix>
                <icon-font name="user" size="30" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              show-password
              @keydown.enter="handleLogin"
            >
              <template #prefix>
                <icon-font name="account-lock" size="30" />
              </template>
            </el-input>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="display: block;width: 100%" @click="handleLogin">
            {{ !loading ? '登录' : '登录中...' }}
          </el-button>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
h2 {
  margin: 0;
}

.card {
  border-radius: 18px;
}

.login {
  // width: 300px;
  padding: 20px 0;
  border: 1rpx solid red;
}

.login-page {
  background: linear-gradient(135deg, #f3eaff 0%, #e6f0ff 100%);
}
</style>
