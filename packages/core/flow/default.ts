import type { Flow } from '@sugar/types';

export const flows: Flow[] = [
  {
    name: 'git-back',
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
    name: 'git-push',
    alias: 'push',
    desc: 'push',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['rev-parse', '--abbrev-ref', 'HEAD'],
        catch: 'branch'
      },
      {
        type: 'shell',
        command: 'git',
        args: (ctx) => {
          return ['config', '--get', `branch.${ctx.var.branch}.remote`];
        },
        catch: 'remote'
      },
      {
        type: 'shell',
        command: 'git',
        args: (ctx) => {
          return ['push', ctx.var.remote, ctx.var.branch];
        }
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
    name: 'git-commit',
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
