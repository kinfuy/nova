<template>
  <div v-for="commit in commitStore.commits" :key="commit.shortHash">{{ commit.message }}</div>
</template>

<script setup lang="ts">
import { useCommit } from '../store/useCommit';

const commitStore = useCommit();
</script>
