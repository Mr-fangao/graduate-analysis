<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import axios from "axios";
let timer = null;
let timer2 = null;
const currtime = ref(null); //时间
const currtemp = ref(null); //温度
const currwind = ref(null); //风
const currcity = ref(null); //当前城市
const currimg = ref(null); //当前图片
// 获取当前时间
function getCurrTime(now) {
	let hour = now.getHours(); //小时数（0到23）
	let minute = now.getMinutes(); //分钟数（0到59）
	let second = now.getSeconds(); //秒数（0到59）
	let second_0 = second < 10 ? "0" : "";
	let minute_0 = minute < 10 ? "0" : "";
	let hour_0 = hour < 10 ? "0" : "";
	return hour_0 + hour + ":" + minute_0 + minute + ":" + second_0 + second;
}
// 更新时间
function updateTime() {
	let newdate = new Date().getTime(); //获取到当前时间戳
	let objdate = new Date(newdate); //创建一个指定的日期对象
	currtime.value = getCurrTime(objdate);
}
// 根据天气获取图片
function getCurrentImg(text) {
	let imgUrl = "/img/weather/duoyun.svg";
	if (text.indexOf("雨") >= 0) imgUrl = "/img/weather/yu.svg";
	if (text.indexOf("云") >= 0) imgUrl = "/img/weather/duoyun.svg";
	if (text.indexOf("雪") >= 0) imgUrl = "/img/weather/xue.svg";
	if (text.indexOf("雾") >= 0) imgUrl = "/img/weather/wu.svg";
	if (text.indexOf("沙尘暴") >= 0) imgUrl = "/img/weather/shachenbao.svg";
	switch (text) {
		case "多云":
			imgUrl = "/img/weather/duoyun.svg";
			break;
		case "阴":
			imgUrl = "/img/weather/yin.svg";
			break;
		case "晴":
			imgUrl = "/img/weather/qing.svg";
			break;
	}
	return imgUrl;
}
// 获取天气
function getWeather() {
	// https://lbs.amap.com/api/webservice/guide/api/weatherinfo api文档
	axios
		.get(
			"https://restapi.amap.com/v3/weather/weatherInfo?city=" +
			341100 +
			"&key=1285054791b4878850efee90e9689a6d&extensions=base",
		)
		.then((res) => {
			// console.log(res);
			try {
				let liveWeather = res.data.lives[0];
				let weather = liveWeather.weather;
				currwind.value = liveWeather.winddirection + "风" + liveWeather.windpower + "级";
				currcity.value = liveWeather.city;
				currtemp.value = liveWeather.temperature + "°C";
				currimg.value = getCurrentImg(weather);
			} catch (err) {
				console.log(err);
			}
		});
}
onBeforeMount(() => {
	updateTime();
	getWeather();
});
onMounted(() => {
	timer = setInterval(() => {
		updateTime();
	}, 1000);
	timer2 = setInterval(() => {
		getWeather();
	}, 1800000);
});
onBeforeUnmount(() => {
	if (timer) {
		clearInterval(timer);
		timer = null;
	}
	if (timer2) {
		clearInterval(timer2);
		timer2 = null;
	}
});
</script>
<template>
	<div class="DateWeather">
		<img :src="currimg" class="wType" />
		<div class="t1">
			<div class="d1">{{ currtemp }}</div>
			<div class="d2">{{ currwind }}</div>
		</div>
		<div class="divideLine"></div>
		<div class="t1">
			<div class="d1">{{ currtime }}</div>
			<div class="d2"><img src="./assets/position.svg" />{{ currcity }}</div>
		</div>
	</div>
</template>
<style lang="less" scoped>
.DateWeather {
	position: absolute;
	/*left: 6.7vh;*/
	right: 14vh;
	top: 1.2vh;
	z-index: 9999;
	display: flex;

	/*display: none;*/
	.wType {
		width: 3.5vh;
	}

	.t1 {
		width: 8.2vh;
		height: 4vh;

		.d1,
		.d2 {
			width: 100%;
			float: left;
			height: 2vh;
			text-align: center;
			font-size: 1.3vh;
			font-family: puhui_Regular_55;
			color: #fff;

			img {
				display: inline-block;
				width: 1vh;
				margin-bottom: -0.1vh;
				margin-right: 0.4vh;
			}
		}

		.d1 {
			line-height: 2vh;
		}

		.d2 {
			line-height: 2vh;
		}
	}

	.divideLine {
		width: 0.2vh;
		height: 2.6vh;
		margin-top: 0.5vh;
		background: #009adc;
	}
}
</style>
