<script setup lang="ts">
import type { TestModel } from './types';

import { testApi } from '@/api/test';

import Comtest from './comtest.vue';

import { ref } from 'vue';

const s = ref<TestModel>();
const sss = ref<TestModel>();
function handleTest() {
  return testApi();
}
</script>

<template>
  <div class="container">sss{{}}</div>
  <div id="ssssss" class="container" @click="handleTest">sss{{}}</div>
  <Comtest v-model="s" />
</template>

<style scoped lang="scss"></style>
