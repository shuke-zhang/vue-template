<script setup lang="ts">
import editor from './editor.vue'

const content = ref('')
</script>

<template>
  <div class="app-container p-[20px]">
    <editor v-model="content" />
  </div>
</template>

<style scoped lang="scss">
</style>
