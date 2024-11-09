<script setup lang="ts">
import { ref } from 'vue';
import Comtest from './comtest.vue';
const s = ref(0);
console.log(s);

function handleTest() {}
</script>

<template>
  <div class="container">sss{{}}</div>
  <div id="ssssss" class="container" @click="handleTest">sss{{}}</div>
  <Comtest v-model="s" />
</template>

<style scoped lang="scss"></style>
