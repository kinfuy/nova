import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useCommit = defineStore(
  'git-commit',
  () => {
    const commits = ref<any>([]);
    function setCommits(val: any[]) {
      commits.value = val;
    }
    return {
      commits,
      setCommits
    };
  },
  {
    persist: true
  }
);
