<template>
  <div v-for="commit in commitStore.commits" :key="commit.shortHash">{{ commit }}</div>
</template>

<script setup lang="ts">
import { useCommit } from '../store/useCommit';

const commitStore = useCommit();

console.log(commitStore.commits);
</script>
