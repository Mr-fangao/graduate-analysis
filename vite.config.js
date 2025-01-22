/*
 * @Author: liqifeng
 * @Date: 2025-01-21 09:48:57
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-21 15:26:52
 * @Description: 
 */
import { defineConfig , loadEnv} from 'vite';
import commonjs from 'vite-plugin-commonjs';
import { createVitePlugins, createBuildOptions } from "./vite";
import vue from '@vitejs/plugin-vue';
import path from 'path';
const resolve = (dir) => path.join(__dirname, dir)
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      less: {
        // 这里可以添加全局的 Less 变量或混入
        // additionalData: `@import "@/styles/variables.less";`
      }
    }
  },
  base: "/", //打包相对路径
		resolve: {
			// 配置别名
			alias: {
				"@": resolve("src"),
			},
		},
})
