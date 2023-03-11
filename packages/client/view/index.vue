<template>
  <div class="graph-content">
    <div class="graph-commit">
      <el-timeline>
        <el-timeline-item v-for="commit in commitStore.commits" :key="commit.shortHash" :timestamp="commit.date">
          {{ commit.message }}
        </el-timeline-item>
      </el-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CustomPayload } from '@nova/types';
import { nextTick, onMounted } from 'vue';
import { useWebSocket } from '../hooks/useWebSocket';
import { useCommit } from '../store/useCommit';
const ws = useWebSocket();
const commitStore = useCommit();
onMounted(() => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'nova-client:get-commits'
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
}
</style>
