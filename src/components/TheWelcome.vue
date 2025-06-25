<script setup lang="ts">
import { logger } from '@shuke~/logger';

const sss = ref(0);

logger.info('logger.info');
logger.warn('logger.warn');
logger.error('logger.error');
logger.success('logger.success');
</script>

<template>
  <div>
    sss:{{ sss }}
    <div class="bg-red-500">
      测试
    </div>
  </div>
</template>
