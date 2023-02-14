<template>
  <HomePage />
</template>

<script setup lang="ts">
import HomePage from './components/homePage.vue';
import { setupWebSocket } from './ws';
setupWebSocket('ws', 'localhost:5124');
</script>
