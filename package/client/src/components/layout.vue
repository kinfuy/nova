<template>
  <div class="clown-git-layout">
    <div class="layout-silder">
      <div class="silder-logo">
        <img src="../../public/favicon.png" alt="" />
        <span>clown-git</span>
      </div>
      <div class="silder-menu">
        <span>Graph</span>
        <span class="text-desc">分支管理</span>
      </div>
      <div class="silder-menu">
        <span>GitFlow</span>
        <span class="text-desc">流程预设</span>
      </div>
      <div class="silder-menu">
        <span>Setting</span>
        <span class="text-desc">全局配置</span>
      </div>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
@import '../styles/var.less';
.clown-git-layout {
  width: 100%;
  display: flex;
  .layout-silder {
    width: 300px;
    height: 100vh;
    background-color: rgba(249, 250, 251);
    box-sizing: border-box;
    .silder-logo {
      display: flex;
      align-items: center;
      height: 50px;
      width: 100%;
      padding: 10px 50px;
      img {
        width: 28px;
        height: 28px;
      }
    }
    .silder-menu {
      width: 100%;
      cursor: pointer;
      padding: 10px 50px;
      box-sizing: border-box;
      border-radius: 4px;
      &:hover {
        background-color: #f1f1f1;
      }

      .text-desc {
        font-size: 12px;
        margin-left: 4px;
        color: rgba(156, 163, 175);
      }
      &:hover {
        color: @theme-color;
        .text-desc {
          color: @theme-color;
        }
      }
    }
  }
  .layout-content {
    width: calc(100% - 300px);
    flex: 0 0 auto;
  }
}
</style>
