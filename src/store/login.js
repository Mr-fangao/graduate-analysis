import { defineStore } from "pinia";
import { ref, reactive, toRefs } from "vue";


export default defineStore("login", () => {
	const state = reactive({
		FyRouteList: "",
		FyUserDetail: "",
		MenuIndex: "/home/datapanel", //默认主页
		MapMode: "image", //vector，image,fullview
		leftCollapse: false,
		rightCollapse: false,
		weather: null,
		airPortDetail: {}, //机库信息
		airLineDetail: {}, //航线信息
		airTaskDetail: {}, //飞行任务信息
		airDetail: {}, //无人机信息
		isFly: false,
	});
	// 登录
	function Login(data) {
		
	}
	// 注册
	function Register(data) {
	
	}
	// 退出系统
	function Logout() {
		return new Promise((resolve, reject) => {

			resolve("已退出!");
		});
	}
	// 展开面板
	function openPanel() {
		state.leftCollapse = false;
		state.rightCollapse = false;
	}
	// 折叠面板
	function closePanel() {
		state.leftCollapse = true;
		state.rightCollapse = true;
	}

	return {
		...toRefs(state),
		Login,
		Logout,
		Register,
		openPanel,
		closePanel,
	};
});
