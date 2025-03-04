/*
 * @Author: wyy
 * @Date: 2025-01-21 09:48:57
 * @LastEditors: wyy Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-23 17:55:23
 * @Description: 
 */
import { createApp } from 'vue'
import './style.css'
import router from "./router";
import App from './App.vue'
import * as echarts from "echarts";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import { createPinia } from "pinia";

const app =  createApp(App);
const pinia = createPinia();
app.use(ElementPlus, {
	locale: zhCn,
});
window.echarts = echarts;

app.use(router);
app.use(pinia);

import Antd from "ant-design-vue";
import "ant-design-vue/dist/reset.css";
app.use(Antd);

app.mount('#app');