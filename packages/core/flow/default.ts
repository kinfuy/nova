import type { Flow } from '@nova/types';

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
    name: 'chore-build',
    alias: 'build',
    desc: 'chore-build',
    actions: [
      {
        type: 'shell',
        command: 'pnpm',
        args: ['run', 'build']
      },
      {
        type: 'shell',
        command: 'git',
        args: ['add', '.']
      },
      {
        type: 'shell',
        command: 'git',
        args: ['commit', '-m', 'chore: build']
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
  },
  {
    name: 'git-prune',
    alias: 'prune',
    desc: '同步删除远程分支',
    actions: [
      {
        type: 'shell',
        command: 'git',
        args: ['remote', 'prune', 'origin']
      }
    ]
  }
];
