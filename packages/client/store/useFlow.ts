import type { FlowDesc } from '@sugar/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFlow = defineStore(
  'flow',
  () => {
    const flows = ref<FlowDesc[]>([]);
    function setFlow(val: FlowDesc[]) {
      flows.value = val;
    }

    function getFlow(name: string) {
      return flows.value.find((x) => x.name === name);
    }

    return {
      flows,
      setFlow,
      getFlow
    };
  },
  {
    persist: true
  }
);
