<script setup lang="ts">
import { defineModel } from 'vue';
const count = defineModel();
</script>

<template>
  <div class="container">{{ count }}</div>
</template>

<style scoped lang="scss"></style>
