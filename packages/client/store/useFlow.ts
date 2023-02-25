import { defineStore } from 'pinia';
import { ref } from 'vue';

const defaultFlow: Flow[] = [
  {
    name: 'fix-detail',
    alias: 'fd',
    desc: '常规fix detail commit',
    actions: [
      {
        command: 'git',
        args: ['add', '.']
      },
      {
        command: 'git',
        args: ['commit', '-m', 'fix: detail']
      }
    ]
  },
  {
    name: 'chore-build',
    alias: 'fb',
    desc: '常规build commit',
    actions: [
      {
        command: 'git',
        args: ['add', '.']
      },
      {
        command: 'git',
        args: ['commit', '-m', 'chore: build']
      }
    ]
  }
];
export const useFlow = defineStore(
  'flow',
  () => {
    const flows = ref<Flow[]>(defaultFlow);
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
