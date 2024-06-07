<template>
  <div class="nova-layout">
    <div class="silder-logo">
      <img src="../assets/favicon.png" alt="logo" />
      <span class="logo-text">Nova Shell 工作流</span>
    </div>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const activeMenu = ref('');

watchEffect(() => {
  activeMenu.value = (route.name as string) || '';
});
</script>

<style lang="less" scoped>
@import '../styles/var.less';
.nova-layout {
  width: 100vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
  background-color: #f4f4f4;
  .silder-logo {
    display: flex;
    align-items: center;
    height: 50px;
    width: 100%;
    .logo-text {
      margin-left: 10px;
      font-size: 20px;
      font-weight: bold;
    }
    img {
      width: 38px;
      height: 38px;
    }
  }
}
</style>
