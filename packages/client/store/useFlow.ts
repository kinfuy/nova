import type { Action, Flow } from '@sugar/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useFlow = defineStore(
  'flow',
  () => {
    const flows = ref<Flow[]>([]);
    function setFlow(val: Flow[]) {
      flows.value = val;
    }
    function setAction(flowName: string, action: Action) {
      flows.value.forEach((flow) => {
        if (flow.name === flowName) {
          flow.actions.push(action);
        }
      });
    }
    function getFlow(name: string) {
      return flows.value.find((x) => x.name === name);
    }

    return {
      flows,
      setFlow,
      getFlow,
      setAction
    };
  },
  {
    persist: true
  }
);
