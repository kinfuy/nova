<p align="center">
  <img width="50px" src="https://user-images.githubusercontent.com/37766068/223753053-5392b064-4507-452f-9a7f-69ada3ce27f9.png">
</p>

<h1 align="center"> nova-sh</h1>

简体中文 | [English](./README.md)

nova-sh is a super personal work cli workstation that lets you execute shell workflows and provide contextual communication capabilities. nova-sh redefines cli tools, making your terminal operations more efficient, smarter, and more fun.

## Progress

- Support script workflows

## Features

- Supports a variety of common shell commands, such as ls, cd, git, curl, etc.
- Supports using natural language to search and execute shell commands
- Supports creating and sharing custom workflows
- Supports viewing and copying command output
- Supports using graphical interface to access common workflows

## Demo

nov run

<img width="600px" src="https://user-images.githubusercontent.com/37766068/226115905-75acc896-5551-455c-8e3e-2f6a4a433c1b.png">

nov run msg

<img width="600px" src="https://user-images.githubusercontent.com/37766068/226115916-cd4776f5-2e98-435d-aa46-31f09642619c.png">

## simple config

```js
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
  }
];
```

## Installation

To install nova-sh, you need a Linux or Mac OS system and have node.js and npm installed. Then you can use the following command to install nova-sh:

```bash
pnpm add -g nova-sh
```

Or you can clone this project from GitHub and run it locally:

```bash
git clone https://github.com/kinfuy/nova-sh.git
cd nova-sh
pnpm install
pnpm run build
```

## Usage

To start nova-sh, just type `nova` or `nov` keywords in your terminal. The supported commands are as follows:

- nov config Open configuration center

- nov run [name] Execute workflow

## Contributing

If you are interested in this project and want to contribute to it.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the [MIT License](LICENSE).