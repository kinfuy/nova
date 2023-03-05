import type { Flow } from '@clown/types';

export const flows: Flow[] = [
  {
    name: 'git back',
    alias: 'back',
    desc: '回退最近commit到暂村区',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['reset', '--soft', 'HEAD^']
      }
    ]
  },
  {
    name: 'git push',
    alias: 'push',
    desc: 'push',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['push', 'origin', 'master']
      }
    ]
  },
  {
    name: 'fix-detail',
    alias: 'fd',
    desc: '常规fix detail commit',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['add', '.']
      },
      {
        type: 'shell',
        command: 'git',
        args: ['commit', '-m', 'fix: detail']
      }
    ]
  },
  {
    name: 'commit',
    alias: 'msg',
    desc: 'commit msg',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['add', '.']
      },
      {
        type: 'params',
        name: 'message',
        params: {
          type: 'input',
          message: '输入commit msg'
        }
      },
      {
        type: 'shell',
        command: 'git',
        args: (ctx) => {
          return ['commit', '-m', `${ctx.var?.message}`];
        }
      }
    ]
  }
];
