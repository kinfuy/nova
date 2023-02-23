<template>
  <div class="clown-git-layout">
    <div class="layout-silder">
      <div class="silder-logo">
        <img src="../../public/favicon.png" alt="logo" />
        <span>Clown Git</span>
      </div>
      <div
        v-for="item in menuOptions"
        :key="item.name"
        class="silder-menu"
        :class="{ 'menu-active': activeMenu === item.name }"
        @click="handleClick(item)"
      >
        <span>{{ item.name.replace(/^\S/, (s) => s.toUpperCase()) }}</span>
        <span class="text-desc">{{ item.zh_name }}</span>
      </div>
    </div>
    <div class="layout-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';

interface Menu {
  name: string;
  zh_name: string;
}

const menuOptions = ref<Menu[]>([
  {
    name: 'graph',
    zh_name: '分支管理'
  },
  {
    name: 'gitFlow',
    zh_name: '流程预设'
  },
  {
    name: 'setting',
    zh_name: '全局配置'
  }
]);

const route = useRoute();
const router = useRouter();

const activeMenu = ref('');

watchEffect(() => {
  activeMenu.value = (route.name as string) || '';
});

const handleClick = (item: Menu) => {
  router.push({
    name: item.name
  });
};
</script>

<style lang="less" scoped>
@import '../styles/var.less';
.clown-git-layout {
  width: 100%;
  display: flex;
  .layout-silder {
    width: 260px;
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
    .menu-active {
      background-color: #f1f1f1;
      color: @theme-color;
      .text-desc {
        color: @theme-color;
      }
    }
  }
  .layout-content {
    width: calc(100% - 260px);
    flex: 0 0 auto;
  }
}
</style>
