<script setup lang="ts">
import { data } from '@/components/data';

import { Download, Search } from '@element-plus/icons-vue';
import {logger} from '@shuke~/logger';
// import HelloWorld from './components/HelloWorld.vue';
// import { RouterLink, RouterView } from 'vue-router';
function test() {
  // ElMessage.warning({
  //   message: '测试sds',
  // });

  ElMessageBox.alert('这是内容', '标题', {
    confirmButtonText: '确定',
    callback: () => {
      ElMessage({
        type: 'info',
        message: `测试`,
      });
    },
  });
}
console.log(__DEV__, '__DEV__');
console.log(__PROD__, '__PROD__');
console.log(__APP_TITLE__, '__APP_TITLE__');
console.log(__API_URL__, '__API_URL__');

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
];
const total = 100;
const queryParams = reactive({
  current: 1,
  size: 10,
});
function getList() {
  console.log(queryParams);
}

logger.info('测试');
</script>

<template>
  <el-button type="primary" :icon="Download" @click="test">测试</el-button>
  <el-button type="danger" :icon="Search" @click="test">搜索</el-button>
  <el-button type="warning" :icon="Search" @click="test">搜索</el-button>

  <div border-solid ml-3 mt-30 px-4 w-100 h-100 border-5 class="bg-#282c34">
    ssss
  </div>
  {{ data }}

  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
  <Pagination
    v-show="total > 0"
    v-model:page="queryParams.current"
    v-model:limit="queryParams.size"
    :total="total"
    @pagination="getList"
  />
  <!-- <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />
    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->

  <!-- <RouterView /> -->
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  background-color: #fff;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
  background-color: red;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
