<template>
  <div flex px-16 p-10 text-center justify-end>
    <span cursor-pointer @click="toggleDark()">dork</span>
  </div>
  <div v-for="commit in commitStore.commits" :key="commit.shortHash">{{ commit.message }}</div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { useCommit } from '../store/useCommit';

const isDark = useDark();
const toggleDark = useToggle(isDark);

const commitStore = useCommit();
</script>
