<template>
  <div class="graph-content">
    <div class="graph-commit">
      <div v-for="commit in commitStore.commits" :key="commit.shortHash">{{ commit.message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomPayload } from '@sugar/types';
import { nextTick, onMounted } from 'vue';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCommit } from '../store/useCommit';
const ws = useWebSocket();
const commitStore = useCommit();
onMounted(() => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'sugar-client:get-commits'
  };
  nextTick(() => {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(event));
    }
  });
});
</script>

<style lang="less" scoped>
@import '../styles/var.less';
.graph-content {
  padding: 10px;
  box-sizing: border-box;
  height: 100%;
  .graph-commit {
    height: calc(100% - 40px);
    overflow-y: auto;
  }
}
</style>
