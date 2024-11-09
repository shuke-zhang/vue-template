<script setup lang="ts">
import Comtest from './comtest.vue';
import { ref } from 'vue';
import type { TestModel } from './types';
const s = ref<TestModel>();
console.log(s);

function handleTest() {
  const title = '测试  ';
  console.log(title);
}
</script>

<template>
  <div class="container">sss{{}}</div>
  <div id="ssssss" class="container" @click="handleTest">sss{{}}</div>
  <Comtest v-model="s" />
</template>

<style scoped lang="scss"></style>
