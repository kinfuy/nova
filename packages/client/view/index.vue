<template>
  <div class="graph-content">
    <span class="theme-switch">dark</span>
    <div v-for="commit in commitStore.commits" :key="commit.shortHash">{{ commit.message }}</div>
  </div>
</template>

<script setup lang="ts">
import { useCommit } from '../store/useCommit';

const commitStore = useCommit();
</script>

<style lang="less" scoped>
@import '../styles/var.less';
.graph-content {
  padding: 10px;
  .theme-switch {
    padding: 4px 8px;
    cursor: pointer;
    &:hover {
      color: @theme-color;
    }
  }
}
</style>
