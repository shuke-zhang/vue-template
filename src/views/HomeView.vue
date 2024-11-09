<script setup lang="ts">
import { computed } from 'vue';
const sss = computed(() => 1 + 1);
const props = defineProps({});
console.log(props);
console.log(sss);

import TheWelcome from '../components/TheWelcome.vue';
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
