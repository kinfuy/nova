<template>
  <div class="nova-layout">
    <el-container>
      <el-aside width="200px">
        <div class="silder-logo">
          <img src="../assets/favicon.png" alt="logo" />
          <span style="margin-left: 5px">nova</span>
        </div>
        <div
          v-for="item in menuOptions"
          :key="item.name"
          class="silder-menu"
          :class="{ 'menu-active': activeMenu === item.name }"
          @click="handleClick(item)"
        >
          <Icon :size="20">
            <component :is="item.icon" />
          </Icon>

          <span style="margin-left: 5px">{{ item.zh_name }}</span>
        </div>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { markRaw, ref, watchEffect } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IconCloudshell, IconGraph, IconShangpu, IconShezhi } from 'nova-sh-icons';
import Icon from '../components/Icon/index.vue';

interface Menu {
  name: string;
  zh_name: string;
  icon: any;
}

const menuOptions = ref<Menu[]>([
  {
    name: 'gitFlow',
    zh_name: '流程预设',
    icon: markRaw(IconGraph)
  },
  {
    name: 'graph',
    zh_name: '分支管理',
    icon: markRaw(IconCloudshell)
  },
  {
    name: 'shop',
    zh_name: '应用商店',
    icon: markRaw(IconShangpu)
  },
  {
    name: 'setting',
    zh_name: '全局配置',
    icon: markRaw(IconShezhi)
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
.nova-layout {
  width: 100%;
  display: flex;
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
</style>
