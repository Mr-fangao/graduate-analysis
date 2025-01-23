<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-22 17:46:56
 * @Description:
-->
<script setup>
import Bus from "@/buss/eventBus";
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, getCurrentInstance } from "vue";
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';
import LoopChart from "@/utils/loopChart.js";
import { loopShowTooltip } from "@/utils/loopShowTooltip.js";
const { proxy } = getCurrentInstance();
const loginStore = useLoginStore();
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
const flyCount = ref([
    { name: "统计城市数", value: 114, color: "#f5bc18", unit: " " },
    { name: "数据年份数", value: 21341, color: "#0cc5c9", unit: " " },
    { name: "毕业生总数", value: 2578, color: "#12c48f", unit: " " },
]);
const l3Data = [
    {
        month: "1",
        value: [1, 3, 6, 2, 0],
    },
    {
        month: "2",
        value: [2, 4, 5, 3, 1],
    },
    {
        month: "3",
        value: [3, 5, 4, 2, 1],
    },
    {
        month: "4",
        value: [4, 6, 3, 1, 2],
    },
    {
        month: "5",
        value: [5, 7, 2, 3, 4],
    },
    {
        month: "6",
        value: [6, 8, 1, 4, 5],
    },
    {
        month: "7",
        value: [7, 9, 0, 5, 6],
    },
    {
        month: "8",
        value: [8, 10, 1, 6, 7],
    },
    {
        month: "9",
        value: [9, 11, 2, 7, 8],
    },
    {
        month: "10",
        value: [10, 12, 3, 8, 9],
    },
    {
        month: "11",
        value: [11, 13, 4, 9, 10],
    },
    {
        month: "12",
        value: [12, 14, 5, 10, 11],
    },
];
const l3YData = ['地理信息', '测绘工程', '遥感科学', '环境科学', '地球物理'];
const r2Data = [
    {
        name: "北京",
        value: 100,
    },
    {
        name: "上海",
        value: 524,
    },
    {
        name: "广州",
        value: 310,
    },
    {
        name: "深圳",
        value: 140,
    },
    {
        name: "杭州",
        value: 210,
    },
];
let l2ChartItem;
let l2_2ChartItem;
let l3ChartItem;
let l3ChartLoop;
let r2ChartItem;
function winResize() {
    if (l3ChartItem) {
        l3ChartItem.resize();
    }
    if (l2ChartItem) {
        l3ChartItem.resize();
    }
    if (r2ChartItem) {
        r2ChartItem.resize();
    }
}
function loadL3Chart(data) {
    let hexColorCodes = [
        "#009adc", // 第二个颜色
        "#FFEB3B", // 黄色
        "#0F9D58", // 亮绿色
        "#FF5733", // 橙色
        "#673AB7", // 深紫色
        "#009688", // 青色
        "#E91E63", // 粉红色
        "#9C27B0", // 紫色
    ];
    let xData = [];
    let yData = [];
    xData = data.map((item) => item.month);
    data[0].value.forEach(() => {
        yData.push([]);
    });
    yData.forEach((item1, index1) => {
        data.forEach((item, index) => {
            item1.push(item.value[index1]);
        });
    });
    console.log(yData, xData);
    let option = {
        backgroundColor: "transparent",
        legend: {
            show: true,
            // icon: "circle",
            top: "3%",
            itemWidth: 15,
            itemHeight: 10,
            itemGap: 10,
            textStyle: {
                color: "#fff",
                fontSize: 8,
            },
        },
        grid: {
            top: "35%",
            left: "15%",
            right: "10%",
            bottom: "10%",
        },
        tooltip: {
            trigger: "axis",
            textStyle: {
                fontSize: 12,
            },
        },
        xAxis: [
            {
                type: "category",
                data: xData,
                axisLine: {
                    lineStyle: {
                        color: "#3b567a",
                    },
                },

                axisTick: {
                    show: false,
                },
                axisLabel: {
                    margin: 12,
                    inside: false,
                    textStyle: {
                        color: "#a3acb2",
                        fontSize: 12,
                    },
                    formatter: function (value, index) {
                        return value + "月";
                    },
                },
            },
        ],
        yAxis: [
            {
                name: "(次数)", //x轴名称
                type: "value",
                splitNumber: 1,
                nameTextStyle: {
                    //x坐标轴名称的字体样式
                    fontSize: 12,
                    color: "#a3acb2",
                    padding: [0, 35, 10, 0],
                },
                axisTick: {
                    show: false,
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: "#ddd",
                    },
                },
                axisLabel: {
                    textStyle: {
                        color: "#a3acb2",
                        fontSize: 12,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#3b567a",
                        type: "dashed",
                    },
                },
            },
        ],
        series: yData.map((item, index) => {
            return {
                name: l3YData[index],
                type: "line",
                data: item,
                symbolSize: 5,
                symbol: "circle",
                // smooth: true,
                lineStyle: {
                    color: hexColorCodes[index],
                },
                itemStyle: {
                    normal: {
                        color: "#FFFFFF",
                        borderColor: hexColorCodes[index],
                    },
                },
                label: {
                    show: true,
                    position: "top",
                    formatter: function (params) {
                        if (params.value === "0") {
                            return ""; // 数值为0时返回null，表示不显示标签
                        } else {
                            return params.value; // 其他情况返回数值作为标签
                        }
                    },
                    color: hexColorCodes[index],
                    fontSize: 11,
                },
            };
        }),
    };
    return option;
}
function loadL2Chart(l2data) {
    if (l2ChartItem) l2ChartItem.dispose();
    if (l2_2ChartItem) l2_2ChartItem.dispose();
    let color = ["#e72024", "#4b94e1", "#0df6a0", "#1869A0", "#FF9393"];
    let sourceData = l2data;
    const total = sourceData.reduce((num, item) => {
        num += item.value;
        return num;
    }, 0);
    const namesArray = sourceData.map((obj) => obj.name);
    const valueArray = sourceData.map((obj) => obj.value);
    const inSplitWidth = 2;
    const inSplitValue = Math.floor(total / (200 / inSplitWidth));
    const itemSplitWidth = 1;
    const outSplitWidth = inSplitWidth + itemSplitWidth;
    const outSplitValue = Math.floor(total / (200 / outSplitWidth));
    const valueTotal = total + inSplitValue * sourceData.length;
    function getTextAngle(currentAngle, angle) {
        currentAngle = currentAngle + angle;
        if (currentAngle <= 90) {
            return -currentAngle;
        } else if (currentAngle <= 180 && currentAngle > 90) {
            return 180 - currentAngle;
        } else if (currentAngle < 270 && currentAngle > 180) {
            return 180 - currentAngle;
        } else if (currentAngle < 360 && currentAngle >= 270) {
            return 360 - currentAngle;
        }
    }
    const valueData = sourceData.reduce((arr, item) => {
        const currentTotal = arr.reduce((total, item) => {
            total += item.value;
            return total;
        }, 0);

        const currentAngle = 360 * (currentTotal / valueTotal);
        const angle = (360 * (item.value / valueTotal)) / 2;
        arr.push(
            {
                name: item.name,
                value: item.value,
                itemStyle: {},
                label: {
                    lineHeight: 80,
                    rotate: getTextAngle(currentAngle, angle),
                },
            },
            {
                name: "",
                value: inSplitValue,
                itemStyle: {
                    color: "transparent",
                    opacity: 0,
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
            },
        );
        return arr;
    }, []);
    const itemReduced = outSplitValue - inSplitValue;
    const outValueData = sourceData.reduce((arr, item, index) => {
        const currentTotal = arr.reduce((total, item) => {
            total += item.value;
            return total;
        }, 0);

        const currentAngle = 360 * (currentTotal / valueTotal);
        const angle = (360 * (item.value / valueTotal)) / 2;

        arr.push(
            {
                name: item.name,
                value: item.value - itemReduced,
                itemStyle: {
                    // color: 'rgba(160, 60, 60, 0.3)'
                },
                label: {
                    color: "#FFFFFFBB",
                    position: "inside",
                    align: "center",
                    // lineHeight: 20,
                    // verticalAlign: 'top',
                    rotate: getTextAngle(currentAngle, angle),
                },
            },
            {
                name: "",
                value: outSplitValue,
                itemStyle: {
                    color: "transparent",
                    opacity: 0,
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false,
                },
            },
        );

        return arr;
    }, []);

    let option = {
        color: color,
        legend: {
            show: false,
            type: "scroll",
            orient: "vertical",
            left: "20%",
            top: "center",
            itemGap: 18,
            selectedMode: false,
            itemWidth: 10,
            itemHeight: 10,
            // icon: 'pin',
            icon: "square",
            data: namesArray,
        },
        graphic: [
            {
                type: "text",
                left: "center", // 水平居中
                top: "42%",
                style: {
                    text: l2data.reduce((acc, obj) => acc + (parseInt(obj.value) || 0), 0),
                    textAlign: "center",
                    fill: "#f8f8f8", //文字的颜色
                    width: 3,
                    height: 3,
                    fontSize: 18,
                    fontFamily: "puhui_ExtraBold_95",
                },
            },
            {
                type: "text",
                left: "center", // 水平居中
                top: "54%", // 垂直居中
                style: {
                    text: "全部毕业生",
                    textAlign: "center",
                    fill: "#f8f8f8", //文字的颜色
                    width: 3,
                    height: 3,
                    fontSize: 10,
                    fontFamily: "puhui_Regular_85",
                },
            },
        ],

        series: [
            {
                type: "pie",
                data: valueData,
                radius: ["45%", "55%"],
                center: ["50%", "50%"],
                // startAngle: 0,
                label: {
                    show: false,
                    position: "center",
                    align: "center",
                    rotate: false, // 设置标签旋转角度，单位为度,
                    formatter(params) {
                        return params.data.name;
                    },
                },

                labelLine: {
                    show: false,
                },
                emphasis: {
                    scale: true,
                    scaleSize: 10,
                },
                blur: {
                    itemStyle: {
                        opacity: 1,
                    },
                },

                itemStyle: {
                    zIndex: 0,
                },
            },
            {
                type: "pie",
                startAngle: -360 * (itemReduced / 2 / valueTotal) + 90,
                radius: ["55%", "65%"],
                center: ["50%", "50%"],
                itemStyle: {
                    zIndex: 100,
                    // color: 'rgba(160, 60, 60, 0.5)',
                    opacity: 0.3,
                    // borderWidth: 15,
                    // borderColor: 'rgba(0, 0, 0, 0)'
                },
                label: {
                    position: "center",
                    show: false,
                    formatter(params) {
                        return "{a|" + params.data.name + "}";
                    },
                    rich: {
                        a: {
                            opacity: 0.8,
                            lineHeight: 50,
                            color: "#FFFFFF",
                            fontSize: 11,
                        },
                    },
                },
                labelLine: {
                    show: true,
                    length: 10,
                },
                data: outValueData,
            },
        ],
    };
    let option3 = {
        color: color,
        legend: {
            show: true,
            type: "scroll",
            orient: "vertical",
            left: "0%",
            top: "center",
            itemGap: 18,
            selectedMode: false,
            itemWidth: 18,
            itemHeight: 10,
            // icon: 'pin',
            icon: "rect",
            data: namesArray,
            formatter: function (name) {
                for (var i = 0; arguments.length; i++) {
                    var index = namesArray.indexOf(name);
                    return `{a|${name}}  {b${index}|${valueArray[index]}}`;
                }
            },
            textStyle: {
                color: "#FFFFFF",
                rich: (function () {
                    return {
                        a: {
                            fontSize: 11,
                            fontWeight: "normal",
                            fontFamily: "puhui_Regular_55",
                            padding: [0, 2, 0, 2],
                        },
                        b0: {
                            fontFamily: "puhui_Heavy_105",
                            fontSize: 12,
                            fontWeight: "bold",
                            color: color[0],
                        },
                        b1: {
                            fontFamily: "puhui_Heavy_105",
                            fontSize: 12,
                            fontWeight: "bold",
                            color: color[1],
                        },
                        b2: {
                            fontFamily: "puhui_Heavy_105",
                            fontSize: 12,
                            fontWeight: "bold",
                            color: color[2],
                        },
                        b3: {
                            fontFamily: "puhui_Heavy_105",
                            fontSize: 12,
                            fontWeight: "bold",
                            color: color[3],
                        },
                    };
                })(),
            },
        },
        series: [
            {
                type: "pie",
                data: valueData,
                radius: ["0%", "0%"],
                center: ["30%", "50%"],
                // startAngle: 0,
                label: {
                    show: false,
                    position: "center",
                    align: "center",
                    rotate: false, // 设置标签旋转角度，单位为度,
                    formatter(params) {
                        return params.data.name;
                    },
                },

                labelLine: {
                    show: false,
                },
                emphasis: {
                    scale: true,
                    scaleSize: 10,
                },
                blur: {
                    itemStyle: {
                        opacity: 1,
                    },
                },

                itemStyle: {
                    zIndex: 0,
                },
            },
        ],
    };
    //此处设置俩图表是因为，由于环形图靠左，环形图内文字不能完美居中
    l2ChartItem = echarts.init(proxy.$refs.l2);
    l2_2ChartItem = echarts.init(proxy.$refs.l2_2);
    l2ChartItem.setOption(option, true);
    l2_2ChartItem.setOption(option3, true);
    loopShowTooltip(l2ChartItem, option, { loopSeries: true, seriesIndex: 0, loopStep: 2 });
}
// 左边列表折叠按钮
function leftPanelClick() {
    leftCollapse.value = !leftCollapse.value;
    rightCollapse.value = !rightCollapse.value;
}
// 由边列表折叠按钮
function rightPanelClick() {
    leftCollapse.value = !leftCollapse.value;
    rightCollapse.value = !rightCollapse.value;
}
onMounted(() => {
    if (MenuIndex.value == "/home/datapanel") {
        window.addEventListener("resize", winResize);
        loadL2Chart(r2Data);
        setTimeout(() => {
            if (proxy.$refs.l3) {
                l3ChartLoop = new LoopChart({
                    dom: proxy.$refs.l3,
                    chartOption: loadL3Chart(l3Data.slice(0, 5)),
                    time: 2000,
                    data: l3Data.slice(0, 5),
                    total: l3Data.length,
                    render: (data, index) => {
                        data.splice(0, 1);
                        data.push(l3Data[index]);
                        let newOption = loadL3Chart(data);
                        return [newOption, data];
                    },
                });
                l3ChartItem = l3ChartLoop.chartItem;
            }
        }, 100);

    }

});
</script>
<template>
    <div class="Main">
        <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
            <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
            <div class="LabelContent" style="margin-top: 2vh">
                <span class="title-ellipsis">数据总览</span>
            </div>
            <div class="l1">
                <div class="item" v-for="(item, index) in flyCount" :key="index">
                    <div class="i1"
                        :style="'background: url(/img/Main/flycount0' + index + '.png)no-repeat;background-size: 100%;'">
                    </div>
                    <div :style="'color:' + item.color + ' ;background-color:' + item.color + '4D' + ';'" class="i2">
                        <span style="color: #fff; text-align: center; margin: auto">{{ item.name }}</span>
                    </div>
                    <div class="i3">
                        <span class="itemvalue" :style="'color:' + item.color + ';'">{{ item.value }}</span>
                        <span class="itemunit">{{ item.unit }}</span>
                    </div>
                </div>
            </div>
            <div class="LabelContent"><span class="title-ellipsis">2024年毕业生就业城市统计</span></div>
            <div class="l2">
                <div class="l2_left" ref="l2"></div>
                <div class="l2_right" ref="l2_2"></div>
            </div>
            <div class="LabelContent"><span class="title-ellipsis">2024年毕业生就业时间统计</span></div>
            <div class="l3" ref="l3">
            </div>
        </div>
        <div :class="['RightPanel', rightCollapse ? 'closed' : 'opened']">
            <div :class="['collapse', rightCollapse ? 'active' : '']" @click="rightPanelClick"></div>
            <div class="LabelContent" style="margin-top: 2vh"><span class="title-ellipsis"></span></div>
            <div class="r1">
            </div>
            <div class="LabelContent"><span class="title-ellipsis"></span></div>
            <div class="r2" ref="r2"></div>
            <div class="LabelContent"><span class="title-ellipsis"></span></div>
            <div class="r3" ref="r3Ref">
            </div>
        </div>
    </div>

</template>
<style lang="less">
.LeftPanel {
    position: absolute;
    z-index: 2;
    /*top: 10vh;*/
    /*left: 1.1vh;*/
    /*width: 34vh;*/
    /*height: 86vh;*/
    left: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 10vh);
    /*background: url("@/views/assets/leftPanel.png");*/
    /*background-size: 100% 100%;*/
    background: linear-gradient(to right, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    padding-top: 1vh;
    padding-left: 0.5vh;
}

.RightPanel {
    position: absolute;
    padding-top: 1vh;
    z-index: 2;
    /*top: 10vh;*/
    /*right: 1.1vh;*/
    /*width: 34vh;*/
    /*height: 86vh;*/
    right: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 10vh);
    /*background: url("@/views/assets/leftPanel.png");*/
    /*background-size: 100% 100%;*/
    background: linear-gradient(to left, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
}

// .MainLegend {
// 	@keyframes openLeft {
// 		from {
// 			transform: translateX(-35.1vh);
// 		}

// 		to {
// 			transform: translateX(0);
// 		}
// 	}
// 	@keyframes closeLeft {
// 		from {
// 			transform: translateX(0);
// 		}

// 		to {
// 			transform: translateX(-35.1vh);
// 		}
// 	}
// 	&.opened {
// 		animation: openLeft 1s;
// 		animation-fill-mode: forwards;
// 	}
// 	&.closed {
// 		animation: closeLeft 1s;
// 		animation-fill-mode: forwards;
// 	}
// }
.LeftPanel {
    @keyframes openLeft {
        from {
            transform: translateX(-35.1vh);
        }

        to {
            transform: translateX(0);
        }
    }

    @keyframes closeLeft {
        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(-35.1vh);
        }
    }

    &.opened {
        animation: openLeft 1s;
        animation-fill-mode: forwards;
    }

    &.closed {
        animation: closeLeft 1s;
        animation-fill-mode: forwards;
    }

    .collapse {
        position: absolute;
        /*right: -1.85vh;*/
        right: 0;
        height: 7.8vh;
        width: 1.85vh;
        top: calc((100% - 7.8vh) / 2);
        cursor: pointer;
        background: url(@/views/assets/leftArrow.png) no-repeat;
        background-size: 100%;

        &.active {
            background: url(@/views/assets/rightArrow.png) no-repeat;
            background-size: 100%;
            left: calc(100% + 1.8vh);
        }
    }
}

.RightPanel {
    @keyframes openRight {
        from {
            transform: translateX(35.1vh);
        }

        to {
            transform: translateX(0);
        }
    }

    @keyframes closeRight {
        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(35.1vh);
        }
    }

    &.opened {
        animation: openRight 1s;
        animation-fill-mode: forwards;
    }

    &.closed {
        animation: closeRight 1s;
        animation-fill-mode: forwards;
    }

    .collapse {
        position: absolute;
        left: -1.85vh;
        /*left:0;*/
        height: 7.8vh;
        width: 1.85vh;
        top: calc((100% - 7.8vh) / 2);
        cursor: pointer;
        background: url(@/views/assets/leftArrow.png) no-repeat;
        transform: rotate(180deg);
        background-size: 100%;

        &.active {
            background: url(@/views/assets/rightArrow.png) no-repeat;
            background-size: 100%;
            right: calc(100% + 1.8vh);
            left: auto;
        }
    }
}
</style>
<style lang="less" scoped>
.Main {
    .r2 {
        height: 25vh;
        width: 100%;
    }

    .r1 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.2vh;

    }

    .r3 {
        height: 26vh;
        overflow: hidden;
        width: 100%;
        padding-top: 1vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;

        .item {
            margin-top: 1vh;
            width: 30vh;
            height: 7vh;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .l3row {
                padding: 0 0 0 2vh;
                width: 100%;
                display: flex;
                align-items: center;
                color: #fff;
                font-family: "puhui_Regular_55";
                font-size: 1.2vh;

                .itemtype {
                    font-family: "puhui_Medium_65";
                    font-size: 1.5vh;
                }

                .itemstatus {
                    width: auto;
                    padding: 0 0.8vh;
                    margin: 0.5vh 0;
                    height: 2vh;
                    border-top: 1px solid;
                    text-align: center;
                    margin-right: 0.6vh;
                    border-color: #0df6a0;
                    background-color: #0df6a04d;
                    // margin-bottom: 1.5vh
                }
            }

            .l3row1 {
                height: 2vh;
                justify-content: space-between;
                margin: 0.5vh 0;
            }

            .l3row2 {
                justify-content: flex-start;
                height: 4vh;
                background: url("./assets/task.png") no-repeat center center;
                background-size: 100%;
                padding-bottom: 2vh;

                span {
                    width: 14vh;
                }

                .fixed-width-span {
                    display: inline-block;
                    /* 或者使用 block，根据需求选择 */
                    width: 16vh;
                    /* 设置你需要的固定宽度 */
                    white-space: nowrap;
                    /* 防止文本换行 */
                    overflow: hidden;
                    /* 隐藏超出部分 */
                    text-overflow: ellipsis;
                    /* 超长部分显示省略号 */
                }

                .fixed-width-span::after {
                    content: attr(data-hover);
                    /* 使用data-hover属性的值作为内容 */
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    /* 水平居中 */
                    bottom: calc(100% + 10px);
                    /* 放置在元素下方 */
                    display: none;
                    /* 默认隐藏 */
                    padding: 5px;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    z-index: 1;
                    /* 确保tooltip在其他元素之上 */
                }
            }
        }
    }

    .l3 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        padding: 1vh 0;

        .chartname {
            height: 3vh;
            width: 100;
            text-align: center;
            display: flex;
            color: #fff;
            font-size: 1.5vh;
            font-family: puhui_Medium_65;
        }

        .chartitem {
            height: 28vh;
            width: 100%;
        }
    }

    .l2 {
        height: 25vh;
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .l2_right {
            width: 20%;
            height: 25vh;
        }

        .l2_left {
            width: 60%;
            height: 25vh;
        }
    }

    .l1 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.2vh;

        .item {
            height: 95%;
            width: 8.5vh;
            margin: auto 0.8vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .i1 {
                width: 7vh;
                height: 7vh;
                background-size: 100%;
                margin: 1.5vh 1.5vh 0.3vh 1.5vh;
                background-repeat: no-repeat;
            }

            .i2 {
                position: relative;
                width: 100%;
                height: 2.5vh;
                -webkit-border-radius: 1.5vh;
                -moz-border-radius: 1.5vh;
                border: 1px solid;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .i3 {
                margin: 1vh;

                span {
                    font-size: 1.2vh;
                    color: #fff;
                }

                .itemvalue {
                    font-family: puhui_ExtraBold_95;
                    font-size: 2vh;
                    margin-right: 3px;
                }
            }
        }

    }

    .LabelContent {
        width: 32vh;
        height: 3.24vh;
        background: url("../assets/labelBg.png");
        background-size: 100% 100%;
        margin-left: 1vh;
        padding-left: 1.7vh;
        font-size: 1.5vh;
        font-family: puhui_Heavy_105;
        font-style: italic;
        color: #fff;
        line-height: 3.24vh;
        letter-spacing: 0.1vh;
        display: flex;

        .returnbutton {
            cursor: pointer;
            width: 1.7vh;
            height: 1.7vh;
            margin: auto 0;
            margin-left: auto;
            margin-right: 2vh;
        }

        .title-ellipsis {
            white-space: nowrap;
            /* 防止文本换行 */
            overflow: hidden;
            /* 隐藏超出部分 */
            text-overflow: ellipsis;
            /* 超出部分显示省略号 */
            max-width: 20vh;
            /* 设置单元格最大宽度，根据实际需要调整 */
            display: inline-block;
        }
    }

    .LeftPanel {
        position: absolute;
        z-index: 2;
        /*top: 10vh;*/
        /*left: 1.1vh;*/
        /*width: 34vh;*/
        /*height: 86vh;*/
        /*background: url("../assets/leftPanel.png");*/
        /*background-size: 100% 100%;*/
        left: 0;
        top: 7vh;
        width: 34vh;
        height: calc(100% - 10vh);
        background: linear-gradient(to right, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    }

    .RightPanel {
        position: absolute;
        z-index: 2;
        /*top: 10vh;*/
        /*right: 1.1vh;*/
        /*width: 34vh;*/
        /*height: 86vh;*/
        /*background: url("../assets/leftPanel.png");*/
        /*background-size: 100% 100%;*/
        right: 0;
        width: 34vh;
        top: 7vh;
        height: calc(100% - 10vh);

        background: linear-gradient(to left, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    }
}
</style>
