<script setup lang="ts">
import type { TreeNode } from './model/test';
import type { TestModel } from './types';

import { testApi } from '@/api/test';

import Comtest from './comtest.vue';
import datas from './data';

import { ref } from 'vue';

const s = ref<TestModel>();
const tree = ref<TreeNode>({});
function handleTest() {
  return testApi();
}
</script>

<template>
  <div class="container">sss{{}}</div>
  <div id="ssssss" class="container" @click="handleTest">sss{{}}</div>
  {{ datas }}
  <Comtest v-model="s" />
</template>

<style scoped lang="scss"></style>
