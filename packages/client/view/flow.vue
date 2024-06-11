<template>
  <div class="nova-flow-create">
    <ElButton type="primary" link @click="handleCreate">新建</ElButton>
  </div>
  <div class="nova-flow">
    <div v-for="item in flows" :key="item.name" class="box-card">
      <div class="card-header">
        <div class="card-alias">
          {{ item.alias }}
        </div>
        <div class="card-title">{{ item.name }}</div>
      </div>
      <div class="card-desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { CustomPayload, FlowDesc } from 'nova-sh-types';
import { IconBofang } from 'nova-sh-icons';
import { nextTick, onMounted } from 'vue';
import { ElButton } from 'element-plus';
import Icon from '../components/Icon/index.vue';
import { useWebSocket } from '../hooks/useWebSocket';
import { useFlow } from '../store/useFlow';

const { flows } = storeToRefs(useFlow());

const ws = useWebSocket();
const handleClick = (item: FlowDesc) => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'nova-client:run-flow',
    data: item
  };
  if (ws && ws.readyState === 1) {
    ws.send(JSON.stringify(event));
  }
};

const handleCreate = () => {
  // const event: CustomPayload = {
  //   type: 'custom',
  //   event: 'nova-client:create-flow',
  //   data: flows.value[0]
  // };
  // if (ws && ws.readyState === 1) {
  //   ws.send(JSON.stringify(event));
  // }
};

onMounted(() => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'nova-client:get-flows'
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
.nova-flow-create {
  padding: 30px 10px 10px;
  display: flex;
  justify-content: flex-end;
}
.nova-flow {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  .box-card {
    width: 220px;
    margin-right: 12px;
    margin-bottom: 12px;
    background-color: #fff;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    cursor: pointer;
    background: linear-gradient(to right, rgb(124, 215, 177), rgb(183, 201, 209));
    .card-header {
      .card-alias {
        display: inline-block;
        font-size: 28px;
        border-radius: 4px;
      }
      .card-title {
        display: block;
        font-size: 12px;
        flex-grow: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 8px;
      }
    }

    .card-desc {
      margin-top: 12px;
      font-size: 12px;
    }
  }
}
</style>
