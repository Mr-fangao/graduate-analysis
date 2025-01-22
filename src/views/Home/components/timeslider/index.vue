<template>
    <!-- <div>
        {{ props.yearArr }}
    </div> -->
    <div :class="props.bgcolor == 'light' ? 'TimeLine2-light' : 'TimeLine2-dark'">
        <div class="LeftBox">
            <el-slider v-model="value" :step="25" show-stops :show-tooltip="false" :min="minValue" :max="maxValue"
                :marks="marks" @change="handleTimeLineChange" v-if="props.yearArr.length"/>
        </div>
        <div class="RightBox">
            <el-tooltip class="box-item" effect="light" content="上一页" placement="top">
                <el-icon :color="props.bgcolor == 'light' ? '#4a0987' : 'white'" size="30px" @click="handleSub">
                    <DArrowLeft />
                </el-icon>
            </el-tooltip>
 
            <el-tooltip class="box-item" effect="light" content="播放/暂停" placement="top">
                <el-icon :color="props.bgcolor == 'light' ? '#4a0987' : 'white'" size="30px" v-if="playSwitch"
                    @click="handlePlay">
                    <VideoPause />
                </el-icon>
                <el-icon :color="props.bgcolor == 'light' ? '#4a0987' : 'white'" size="30px" v-if="!playSwitch"
                    @click="handlePlay">
                    <VideoPlay />
                </el-icon>
            </el-tooltip>
 
            <el-tooltip class="box-item" effect="light" content="下一页" placement="top">
                <el-icon :color="props.bgcolor == 'light' ? '#4a0987' : 'white'" size="30px" @click="handleAdd">
                    <DArrowRight />
                </el-icon>
            </el-tooltip>
        </div>
    </div>
</template>
 
<script setup>
// vue
import {
    ref,
    watch,
    computed,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
} from "vue";
 
// 宏
// 父组件传参 nowValue-当前选中或自动播放时的当前时间 yearArr-所有年份数组
// const props = defineProps(["bgcolor", "nowValue", "yearArr", 'second']);
const props = defineProps({
    bgcolor: {
        type: String,
        default: "dark",
    },
    nowValue: {
        type: String,
        default: '',
    },
    yearArr: {
        type: Array,
        default: () => [],
    },
    second: {
        type: Number,
        default: 1000,
    },
});
 
// 派发事件 改变当前值-nowValue
const emits = defineEmits(["handleNowValueChange"]);
 
// 变量
// 自动播放 定时器
let timer = null;
// 一页几条
let pageSize = ref(5);
// 当前页数
let pageCode = ref(1);
 
// 当前值
let value = ref(0);
 
let minValue = ref(0);
 
let maxValue = ref(100);
 
// 刻度
const marks = ref({
    // 0: '2000-5',
    // 25: '2000-6',
    // 50: '2000-7',
    // 75: '2000-8',
    // 100: '2000-9',
    // 100: '2000-10',
});
 
// 播放控制 开关 默认关闭
let playSwitch = ref(false);
 
// 子组件 时间数组
let timeArr = ref([]);
 
// 函数
// 时间线发生变化
const handleTimeLineChange = (val) => {
    switch (val) {
        case 0:
            console.log("0");
            emits("handleNowValueChange", timeArr.value[0]);
            break;
        case 25:
            console.log("25");
            emits("handleNowValueChange", timeArr.value[1]);
            break;
        case 50:
            console.log("50");
            emits("handleNowValueChange", timeArr.value[2]);
            break;
        case 75:
            console.log("75");
            emits("handleNowValueChange", timeArr.value[3]);
            break;
        case 100:
            console.log("100");
            emits("handleNowValueChange", timeArr.value[4]);
            break;
    }
 
    // console.log(val);
};
 
// 播放控制
const handlePlay = () => {
    playSwitch.value = !playSwitch.value;
};
 
// 页面减
const handleSub = () => {
    if (pageCode.value > 1) {
        pageCode.value--;
 
        console.log("减");
 
        value.value = 0;
 
        timeArr.value = Array.from(props.yearArr).slice(
            (pageCode.value - 1) * pageSize.value,
            pageCode.value * pageSize.value
        );
 
        emits("handleNowValueChange", timeArr.value[0]);
    }
};
 
// 页面加
const handleAdd = () => {
    if (pageCode.value < Math.ceil(props.yearArr.length / pageSize.value)) {
        pageCode.value++;
 
        console.log("加");
 
        value.value = 0;
 
        timeArr.value = Array.from(props.yearArr).slice(
            (pageCode.value - 1) * pageSize.value,
            pageCode.value * pageSize.value
        );
 
        emits("handleNowValueChange", timeArr.value[0]);
    }
};
 
// 初始监听 为 timeArr赋值
watch(
    () => props.yearArr,
    (newVal, oldVal) => {
        console.log(newVal, oldVal);
 
        timeArr.value = Array.from(newVal).slice(
            (pageCode.value - 1) * pageSize.value,
            pageCode.value * pageSize.value
        );
 
        console.log(timeArr.value);
    }
);
 
// 监听 timeArr 改变 为marks赋值 且 计算最值
watch(
    timeArr,
    (newVal, oldVal) => {
        console.log(newVal, oldVal);
 
        let obj = {};
 
        timeArr.value.forEach((item, index) => {
            obj[index * 25] = item;
        });
 
        console.log(obj);
 
        marks.value = obj;
 
        maxValue.value = (timeArr.value.length - 1) * 25;
    },
    { deep: true }
);
 
// 监听 播放开关
watch(playSwitch, (newVal, oldVal) => {
    if (newVal) {
        timer = setInterval(() => {
            if (value.value < maxValue.value) {
                value.value += 25;
 
                emits(
                    "handleNowValueChange",
                    timeArr.value[Math.floor(value.value / 25)]
                );
            } else {
                value.value = 0;
 
                emits(
                    "handleNowValueChange",
                    timeArr.value[Math.floor(value.value / 25)]
                );
            }
        }, props.second);
    } else {
        if (timer) {
            clearInterval(timer);
        }
    }
});
 
// 生命周期
onBeforeUpdate(() => {
    console.log(props.nowValue, props.yearArr, props.bgcolor, props.second);
});
</script>
 
<style lang="less" scoped>
.TimeLine2-light {
    user-select: none;
 
    width: 100%;
    height: 100%;
 
    border: 2px solid slateblue;
    border-radius: 10px;
 
    background-color: rgba(255, 255, 255, 0.5);
 
    backdrop-filter: blur(10px);
 
    display: flex;
    justify-content: space-between;
    align-items: center;
 
    .LeftBox {
        width: 80%;
        height: 100;
 
        padding: 0px 30px;
 
        :deep(.el-slider__runway ) {
            // height: 10px;
            background-color: #cccccc88;
        }
 
        :deep(.el-slider__button)  {
            width: 10px;
            height: 10px;
            background-color: transparent;
            border: none;
        }
 
        :deep(.el-slider__stop)  {
            width: 1px;
            height: 12px;
            background-color: #4a0987;
            z-index: 999;
            display: block;
        }
 
        :deep(.el-slider__marks-text)  {
            color: #4a0987;
        }
    }
 
    .RightBox {
        width: 20%;
        height: 100;
 
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
}
 
.TimeLine2-dark {
    user-select: none;
 
    width: 100%;
    height: 100%;
 
    border: 2px solid white;
    border-radius: 10px;
 
    background-color: rgba(41, 5, 75, .5);
 
    backdrop-filter: blur(10px);
 
    display: flex;
    justify-content: space-between;
    align-items: center;
 
    .LeftBox {
        width: 80%;
        height: 100;
 
        padding: 0px 30px;
 
        :deep(.el-slider__runway)  {
            // height: 10px;
            background-color: #fff3;
        }
 
        :deep(.el-slider__button)  {
            width: 10px;
            height: 10px;
            background-color: transparent;
            border: none;
        }
 
        :deep(.el-slider__stop)  {
            width: 1px;
            height: 12px;
            background-color: white;
            z-index: 999;
            display: block;
        }
 
        :deep(.el-slider__marks-text)  {
            color: white;
        }
    }
 
    .RightBox {
        width: 20%;
        height: 100;
 
        display: flex;
        justify-content: space-around;
        align-items: center;
    }
}
</style>
