<template>
  <div class="sugar-flow-create" @click="handleCreate">新建</div>
  <div class="sugar-flow">
    <div v-for="item in flows" :key="item.name" class="flow-card">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import type { CustomPayload, Flow } from '@sugar/types';
import { IconBofang } from '@sugar/icons';
import { onMounted } from 'vue';
import Icon from '../components/Icon/index.vue';
import { useWebSocket } from '../hooks/useWebSocket';
import { useFlow } from '../store/useFlow';

const { flows } = storeToRefs(useFlow());

const ws = useWebSocket();
const handleClick = (item: Flow) => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'sugar-client:run-flow',
    data: item
  };
  ws!.send(JSON.stringify(event));
};

const handleCreate = () => {
  const event: CustomPayload = {
    type: 'custom',
    event: 'sugar-client:create-flow',
    data: flows.value[0]
  };
  ws!.send(JSON.stringify(event));
};

const event: CustomPayload = {
  type: 'custom',
  event: 'sugar-client:get-flows'
};
ws!.send(JSON.stringify(event));
</script>

<style lang="less" scoped>
@import '../styles/var.less';
.sugar-flow-create {
  padding: 30px 10px 10px;
  cursor: pointer;
}
.sugar-flow {
  padding: 10px;
  display: flex;
  flex-wrap: wrap;

  .flow-card {
    width: 200px;
    height: 60px;
    box-shadow: 0 0 4px #ddd;
    padding: 10px;
    margin-right: 20px;
    &:hover {
      box-shadow: 0 0 4px #ccc;
    }
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
}
</style>
