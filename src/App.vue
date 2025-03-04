<!--
 * @Author: wyy
 * @Date: 2025-01-21 09:48:57
 * @LastEditors: wyy Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-22 11:52:32
 * @Description: 
-->
<script setup>
// import HelloWorld from './components/HelloWorld.vue'
import login from '@/views/Login/index.vue'
</script>

<template>
      <!-- <router-view ></router-view> -->
  <!-- <div>

  </div> -->
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
  <!-- <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <login msg="Vite + Vue" /> -->
</template>

<style >
	@import url("./assets/font.css");
</style>
