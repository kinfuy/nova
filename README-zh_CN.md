<p align="center">
  <img width="50px" src="https://user-images.githubusercontent.com/37766068/223753053-5392b064-4507-452f-9a7f-69ada3ce27f9.png">
</p>

<h1 align="center"> nova-sh</h1>
<p align="center">
  <a href="https://www.npmjs.org/package/nova-sh">
  <img src="https://img.shields.io/npm/v/nova-sh.svg">
  </a>
  <a href="https://npmcharts.com/compare/nova-sh?minimal=true">
  <img src="https://img.shields.io/npm/dm/nova-sh.svg?color=357C3C">
  </a>
  <a href="https://npmcharts.com/compare/nova-sh?minimal=true">
  <img src="https://img.shields.io/npm/l/nova-sh.svg?color=blue">
  </a>

  </a>
  <br>
</p>

简体中文 | [English](./README.md)

</p> <h1 align="center"> nova-sh</h1> 
 nova-sh 是一个超级个人工作 cli 工作站，它可以让你执行 shell 工作流，并提供上下文沟通能力。nova-sh 重新定义了 cli 工具，让你的终端操作更高效、更智能、更有趣。

## 进度

- 支持脚本工作流

## 特性

- 支持多种常用的 shell 命令，如 ls, cd, git, curl 等 - 支持使用自然语言搜索和执行 shell 命令
- 支持创建和分享自定义的工作流
- 支持查看和复制命令的输出
- 支持使用图形界面访问常用的工作流

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

## 安装

要安装 nova-sh，你需要有一个 Linux 或 Mac OS 的系统，并且已经安装了 node.js 和 npm。然后，你可以使用以下命令来安装 nova-sh：

```bash
pnpm add -g nova-sh
```

或者，你也可以从 GitHub 上克隆本项目，并在本地运行：

```bash
 git clone https://github.com/kinfuy/nova-sh.git
 cd nova-sh
 pnpm install
 pnpm run build
```

## 使用

要启动 nova-sh，你只需要在终端中输入 `nova` 或者`nov` 关键字，支持的命令如下

- nov config 打开配置中心
- nov run 【name】 执行工作流

## 贡献

如果你对本项目感兴趣，欢迎为其做出贡献

## 许可证

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 本项目采用 [MIT 许可证](LICENSE)。
