import vue from "@vitejs/plugin-vue";
import createCompression from "./plugins/compression";
import setupExtend from "vite-plugin-vue-setup-extend-plus";
import autoImport from "unplugin-auto-import/vite";
import { visualizer } from "rollup-plugin-visualizer";
import resolveExternalsPlugin from "vite-plugin-resolve-externals";
import externalGlobals from "rollup-plugin-external-globals";

// 插件配置
export function createVitePlugins(viteEnv, isBuild = false) {
	const vitePlugins = [vue()];
	// 组件自动导入
	vitePlugins.push(
		autoImport({
			imports: ["vue", "vue-router", "pinia"],
			dts: "src/auto-import.d.ts",
		}),
	);
	// 组件命名
	vitePlugins.push(setupExtend());
	// 打包可视化界面
	vitePlugins.push(visualizer({ open: true }));
	// cdn引入配置
	vitePlugins.push(
		resolveExternalsPlugin({
			h337: "h337",
			Cesium: "Cesium",
			FyConfig: "FyConfig",
			PhotoSphereViewer: "PhotoSphereViewer",
		}),
	);

	isBuild && vitePlugins.push(...createCompression(viteEnv));
	return vitePlugins;
}
// 打包配置
export function createBuildOptions(viteEnv) {
	return {
		//浏览器兼容性  "esnext"|"modules"
		target: "modules",
		//指定输出路径
		outDir: viteEnv.VITE_OUTPUT_DIR,
		//生成静态资源的存放路径
		assetsDir: "assets",
		//小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 0 可以完全禁用此项
		assetsInlineLimit: 4096,
		//启用/禁用 CSS 代码拆分
		cssCodeSplit: true,
		//构建后是否生成 source map 文件
		sourcemap: false,
		//@rollup/plugin-commonjs 插件的选项
		commonjsOptions: {},
		//当设置为 true，构建后将会生成 manifest.json 文件
		manifest: false,
		// 设置为 false 可以禁用最小化混淆，或是用来指定使用哪种混淆器 boolean | 'terser' | 'esbuild'
		minify: "terser", //terser 构建后文件体积更小
		//传递给 Terser 的更多 minify 选项。
		terserOptions: {},
		//设置为 false 来禁用将构建后的文件写入磁盘
		write: true,
		//默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录。
		emptyOutDir: true,
		//启用/禁用 brotli 压缩大小报告
		brotliSize: true,
		//chunk 大小警告的限制
		chunkSizeWarningLimit: 500,
		//自定义底层的 Rollup 打包配置
		rollupOptions: {
			// 外部引入的不打包
			external: ["h337", "FyConfig", "Cesium", "PhotoSphereViewer"],
			plugins: [
				externalGlobals({
					h337: "h337",
					FyConfig: "FyConfig",
					Cesium: "Cesium",
					PhotoSphereViewer: "PhotoSphereViewer",
				}),
			],
		},
	};
}
