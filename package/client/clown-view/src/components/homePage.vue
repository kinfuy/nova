<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { setupWebSocket } from '../ws';
onMounted(() => {
  const ws = setupWebSocket('ws', 'localhost:8080');
});
</script>
