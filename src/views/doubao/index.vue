<script setup lang="ts">
import { ws_connect_config } from './config'

const uuid = createUUID()
const url = ws_connect_config.base_url
</script>

<template>
  <div class="container">
    你好-{{ uuid }}
  </div>
</template>

<style scoped lang="scss">
</style>
