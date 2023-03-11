<template>
  <div class="nova-flow-create" @click="handleCreate">新建</div>
  <div class="nova-flow">
    <el-row :gutter="20">
      <el-col v-for="item in flows" :key="item.name" :xs="8" :lg="6">
        <el-card shadow="hover">
          <div class="crad-header">
            <div class="card-title">{{ item.name }}</div>
            <div class="card-alias">
              <span>sh：</span>
              <span>{{ item.alias }}</span>
            </div>
            <div class="card-operate">
              <Icon class="icon-btn" :size="24" @click="handleClick(item)">
                <IconBofang />
              </Icon>
            </div>
          </div>
          <div class="card-desc">{{ item.desc }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { CustomPayload, FlowDesc } from '@nova/types';
import { IconBofang } from '@nova/icons';
import { nextTick, onMounted } from 'vue';
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
  cursor: pointer;
}
.nova-flow {
  padding: 10px;
  .crad-header {
    position: relative;
    .card-operate {
      position: absolute;
      right: 0;
      top: 0;
    }
    .card-title {
      font-size: 16px;
      width: calc(100% - 50px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .card-alias {
      display: inline-block;
      font-size: 14px;
      color: #666;
      border-radius: 4px;
    }
  }

  .card-desc {
    font-size: 14px;
    color: #999;
  }
}
</style>
