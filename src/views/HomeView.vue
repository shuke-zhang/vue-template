<script setup lang="ts">
import { computed } from 'vue';

import TheWelcome from '../components/TheWelcome.vue';

const props = defineProps({});
const sss = computed(() => 1 + 1);
console.log(props);
console.log(sss);
</script>

<template>
  <main>
    <TheWelcome />
  </main>
</template>
