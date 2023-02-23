<template>
  <div class="clown-flow">
    <div v-for="item in flows" :key="item.name" class="flow-card">
      <div class="crad-header">
        <span class="card-title">{{ item.name }}</span>
        <span class="card-alias" @click="handleClick(item)">{{ item.alias }}</span>
      </div>
      <div class="card-desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { Flow } from '../../../typings/flow';
import { useWebSocket } from '../hooks/useWebSocket';
import { useFlow } from '../store/useFlow';

const { flows } = storeToRefs(useFlow());

const ws = useWebSocket();
const handleClick = (item: Flow) => {
  ws!.send(
    JSON.stringify({
      key: 'RUN_FLOW',
      flow: item
    })
  );
};
</script>

<style lang="less" scoped>
.clown-flow {
  padding: 30px 10px 10px;
  display: flex;
  flex-wrap: wrap;

  .flow-card {
    width: 200px;
    height: 60px;
    box-shadow: 0 0 4px #ccc;
    padding: 10px;
    margin-right: 20px;
    cursor: pointer;
    &:hover {
      background-color: rgba(29, 125, 250, 0.1);
    }
    .crad-header {
      position: relative;
      .card-alias {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 14px;
        margin-left: 5px;
        padding: 2px 8px;
        background-color: rgb(29, 183, 29);
        color: #fff;
        border-radius: 4px;
      }
    }

    .card-desc {
      color: #999;
    }
  }
}
</style>
