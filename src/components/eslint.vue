<script setup lang="ts">
import { ref } from 'vue';
import Comtest from './comtest.vue';
import type { TestModel } from './types';
import { data } from './data';
import { testApi } from '@/api/test';

const s = ref<TestModel>();

function handleTest() {
  return testApi();
}
</script>

<template>
  <div class="container">sss{{}}</div>
  <div id="ssssss" class="container" @click="handleTest">sss{{}}</div>
  {{ data }}
  <Comtest v-model="s" />
</template>

<style scoped lang="scss"></style>
