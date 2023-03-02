export const flows = [
  {
    name: 'git back',
    alias: 'back',
    desc: '回退最近commit到暂村区',
    actions: [
      {
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
        command: 'git',
        args: ['add', '.']
      },
      {
        command: 'git',
        args: ['commit', '-m', 'fix: detail']
      }
    ]
  }
];
