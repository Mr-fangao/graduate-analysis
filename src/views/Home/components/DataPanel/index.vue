<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-23 17:51:03
 * @Description:
-->
<script setup>
import Bus from "@/buss/eventBus";
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, getCurrentInstance } from "vue";
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';
import LoopChart from "@/utils/loopChart.js";
import { loopShowTooltip } from "@/utils/loopShowTooltip.js";
import TimeMap from "../TimeMap/index.vue";
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
let r1ChartItem;
let r3ChartItem;
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
    if (r1ChartItem) {
        r1ChartItem.resize();
    }
    if (r3ChartItem) {
        r3ChartItem.resize();
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
function loadR1Chart() {
    var source = [{ "industry": "银行", "name": "平安银行", "涨跌幅": -0.14, "量比": 0.83, "Amount": 87362.43 }, { "industry": "全国地产", "name": "万 科Ａ", "涨跌幅": 1.3, "量比": 1.69, "Amount": 197637.2 }, { "industry": "生物制药", "name": "国农科技", "涨跌幅": -3.39, "量比": 0.0, "Amount": 3449.41 }, { "industry": "环境保护", "name": "世纪星源", "涨跌幅": 10.1, "量比": 2.89, "Amount": 12274.01 }, { "industry": "区域地产", "name": "深振业Ａ", "涨跌幅": 1.44, "量比": 2.39, "Amount": 6369.07 }, { "industry": "酒店餐饮", "name": "全新好", "涨跌幅": -0.73, "量比": 1.3, "Amount": 2305.26 }, { "industry": "运输设备", "name": "神州高铁", "涨跌幅": 0.26, "量比": 0.89, "Amount": 4129.22 }, { "industry": "综合类", "name": "中国宝安", "涨跌幅": -0.52, "量比": 0.72, "Amount": 5128.63 }, { "industry": "建筑施工", "name": "*ST美丽", "涨跌幅": 2.04, "量比": 0.0, "Amount": 729.37 }, { "industry": "区域地产", "name": "深物业A", "涨跌幅": 4.24, "量比": 5.19, "Amount": 8691.59 }, { "industry": "玻璃", "name": "南 玻Ａ", "涨跌幅": 0.24, "量比": 0.74, "Amount": 2706.7 }, { "industry": "全国地产", "name": "沙河股份", "涨跌幅": 3.15, "量比": 3.65, "Amount": 8607.37 }, { "industry": "家用电器", "name": "深康佳Ａ", "涨跌幅": 0.47, "量比": 0.88, "Amount": 4960.5 }, { "industry": "文教休闲", "name": "深中华A", "涨跌幅": 0.44, "量比": 0.85, "Amount": 1076.83 }, { "industry": "装修装饰", "name": "*ST神城", "涨跌幅": 5.11, "量比": 0.0, "Amount": 6582.9 }, { "industry": "其他商业", "name": "深粮控股", "涨跌幅": -1.64, "量比": 1.3, "Amount": 5383.55 }, { "industry": "元器件", "name": "深华发Ａ", "涨跌幅": 1.93, "量比": 2.81, "Amount": 2101.73 }, { "industry": "电脑设备", "name": "深科技", "涨跌幅": -0.12, "量比": 0.6, "Amount": 8031.7 }, { "industry": "其他建材", "name": "深天地Ａ", "涨跌幅": 0.92, "量比": 1.4, "Amount": 2597.53 }, { "industry": "汽车服务", "name": "特 力Ａ", "涨跌幅": -0.58, "量比": 0.73, "Amount": 5263.19 }, { "industry": "其他商业", "name": "飞亚达Ａ", "涨跌幅": 0.51, "量比": 1.09, "Amount": 2195.08 }, { "industry": "火力发电", "name": "深圳能源", "涨跌幅": 0.64, "量比": 0.93, "Amount": 3636.08 }, { "industry": "医药商业", "name": "国药一致", "涨跌幅": -0.35, "量比": 1.22, "Amount": 4880.9 }, { "industry": "汽车配件", "name": "富奥股份", "涨跌幅": 0.42, "量比": 0.65, "Amount": 695.9 }, { "industry": "全国地产", "name": "大悦城", "涨跌幅": 2.29, "量比": 1.96, "Amount": 10547.66 }, { "industry": "元器件", "name": "深桑达Ａ", "涨跌幅": 1.6, "量比": 0.75, "Amount": 3038.67 }, { "industry": "综合类", "name": "神州数码", "涨跌幅": -0.3, "量比": 0.79, "Amount": 5104.54 }, { "industry": "环境保护", "name": "中国天楹", "涨跌幅": 1.76, "量比": 0.95, "Amount": 43531.08 }, { "industry": "全国地产", "name": "华联控股", "涨跌幅": 0.2, "量比": 0.76, "Amount": 4961.56 }, { "industry": "火力发电", "name": "深南电A", "涨跌幅": -2.98, "量比": 1.18, "Amount": 5699.69 }, { "industry": "广告包装", "name": "深大通", "涨跌幅": -3.94, "量比": 1.38, "Amount": 16266.95 }, { "industry": "轻工机械", "name": "中集集团", "涨跌幅": 0.0, "量比": 0.68, "Amount": 5116.99 }];
    var temp = {};
    for (var i = 0; i < source.length; i++) {
        var industry = source[i]["industry"];
        if (!temp[industry]) {
            temp[industry] = [];
        }
        temp[industry].push(source[i]);
    }

    var data = [];
    var colors = ['#7591CC', '#5CC9CC', '#CC355B'],
        idx = 0;
    for (var industry in temp) {
        if (!!industry && !!temp[industry] && temp[industry].length > 0) {
            var item = {
                name: industry,
                value: industry.legend,
                itemStyle: {
                    color: colors[idx++ % 3],
                },
                children: []
            }
            for (var i = 0; i < temp[industry].length; i++) {
                var name = temp[industry][i]["name"],
                    change = temp[industry][i]["涨跌幅"],
                    sname = name[i].length;
                item["children"].push({
                    name: industry + '-' + name,
                    value: sname,
                    value1: change,
                    itemStyle: {
                        colorSaturation: change / 10,
                        colorAlpha: 0.8
                    }
                });
            }
            data.push(item);
        }
    }
    // var modes = ['2012Budget', '2011Budget', 'Growth'];
    var option = {
        title: {
            left: 0,
            top: "1%",
            // text: ['{c|}' + '{d|（行业分类）}'],
            // text:[],
            textStyle: {
                rich: {
                    c: {
                        color: '#0000',
                        fontSize: 25,
                        fontWeight: 'bold',
                        width: 4,
                        height: 15,
                        backgroundColor: '#2196f3',

                    },
                    d: {
                        //   color: '#3e4956',
                        fontWeight: 'bold',
                        fontSize: 17,
                        padding: [0, 0, 0, 30],
                    },
                }
            },
        },
        tooltip: {},
        series: [{
            name: '全部',
            type: 'treemap',
            visibleMin: 300,
            data: data,
            leafDepth: 4, //呈现层级，若为1加载时仅展开一层，接下来的每一层通过单击进入，如上面的效果图所示，  
            //每一层级呈现的样式  
            label: {
                show: true,
                fontSize: 12,
                color: '#FFFFFF',
                formatter: function (params) {
                    var arr = [
                        params.name,
                        '涨跌幅: ' + params.value
                    ];
                    return arr.join('\n');
                }
            },

            levels: [{
                colorSaturation: [0.3, 0.7],
                itemStyle: {
                    normal: {
                        borderColor: 'black',
                        borderWidth: 0.5,
                        gapWidth: 2
                    }
                }
            },
            {
                colorSaturation: [0.3, 0.7],
                colorMappingBy: 'id',
                itemStyle: {
                    normal: {
                        // borderColorSaturation: 0.7,
                        gapWidth: 1,
                        borderWidth: 1
                    }
                }
            },
            ]



        }]
    };
    r1ChartItem = echarts.init(proxy.$refs.r1);
    r1ChartItem.setOption(option, true);
}
function loadR2Chart() {
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
        },
        toolbox: {
            show: false,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: {
                    show: true,
                    type: ['pie', 'funnel']
                },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        calculable: true,
        series: [
            {
                name: '面积模式',
                type: 'pie',
                radius: [20, 130],
                center: ['50%', '50%'],
                roseType: 'area',
                label: {
                    show: true,
                    color: '#fff',
                    formatter: (params) => {
                        return ` ${params.name}: ${params.percent}% `;
                    },
                    padding: [-30, -50, 0, 0],
                    textStyle: {
                        lineHeight: 48
                    }
                },
                data: [
                    { value: 10, name: '上海市' },
                    { value: 24, name: '云南省' },
                    { value: 94, name: '内蒙古' },
                    { value: 2, name: '北京市' },
                    { value: 30, name: '四川省' },
                    { value: 64, name: '天津市' },
                    { value: 16, name: '宁夏' },
                    { value: 77, name: '安徽省' },
                    { value: 116, name: '山东省' },
                    { value: 103, name: '山西省' },
                    { value: 12, name: '广东省' },
                    { value: 36, name: '广西' },
                    { value: 47, name: '新疆' },
                    { value: 28, name: '江苏省' },
                    { value: 86, name: '江西省' },
                    { value: 161, name: '河北省' },
                    { value: 164, name: '河南省' },
                    // { value: 28, name: '浙江省' },
                    // { value: 26, name: '海南省' },
                    // { value: 23, name: '湖北省' },
                    // { value: 31, name: '湖南省' },
                    // { value: 30, name: '甘肃省' },
                    // { value: 24, name: '福建省' },
                    // { value: 6, name: '西藏' },
                    // { value: 50, name: '贵州省' },
                    // { value: 100, name: '辽宁省' },
                    // { value: 19, name: '重庆市' },
                    // { value: 22, name: '陕西省' },
                    // { value: 16, name: '青海省' },
                    // { value: 145, name: '黑龙江省' }
                ]
            }
        ]
    };

    r2ChartItem = echarts.init(proxy.$refs.r2);
    r2ChartItem.setOption(option, true);
}
function loadR3Chart() {
    const myData = ['福田区', '罗湖区', '南山区', '盐田区', '宝安区', '龙岗区'];
    // WebGIS，数据生产，外业测绘，事业单位
    const offLine = [
        [20, 40, 60, 60, 10, 20, 40, 20, 20, 10],
        [10, 30, 50, 20, 50, 30, 30, 40, 10, 20],
        [50, 20, 40, 10, 20, 40, 20, 30, 30, 30],
        [20, 10, 30, 40, 10, 10, 10, 40, 40, 40],
    ];

    const onLine = [
        [10, 20, 20, 40, 20, 10],
        [20, 10, 40, 30, 30, 50],
        [30, 30, 30, 20, 40, 20],
        [40, 40, 40, 10, 10, 10],
    ];
    const offLineSum = [100, 100, 180, 130, 90, 100];
    const onLineSum = [100, 100, 130, 100, 100, 90];
    // backgroundColor: '#11356D',
    let option = {
        // backgroundColor: '#11356D',
        /*    title: [
            {
                text: '脱机状态',
                top: '2%',
                left: '30%',
                textStyle: {
                    color: '#DC3239',
                    fontSize: 14,
                },
            },
            {
                text: '联机状态',
                top: '2%',
                right: '30%',
                textStyle: {
                    color: '#2087FE',
                    fontSize: 14,
                },
            },
        ],*/
        legend: [
            {
                // 图例
                top: '2%',
                left: 'center', // 图例距离左侧距离(此处水平居中)
                textStyle: {
                    // 图例文本样式
                    color: '#fff',
                },
                itemGap: 100,

                selectedMode: false, //图例点击失效
                // data: ['脱机状态', '联机状态'],
                data: ['已就业', '已升学'],
            },
            {
                // 图例
                bottom: '2%',
                left: 'center', // 图例距离左侧距离(此处水平居中)
                textStyle: {
                    // 图例文本样式
                    color: '#fff',
                },
                selectedMode: false, //图例点击失效
                data: ['WebGIS', '数据生产', '外业测绘', '事业单位'],
            },
        ],
        tooltip: {
            // 提示框
            show: true,
            trigger: 'axis',
            axisPointer: {
                // 坐标轴指示器配置项。
                type: 'shadow', // 'line' 直线指示器;'shadow' 阴影指示器.
            },
            // formatter: '{b}<br/>脱机: {c}' // 提示框所提示的文本内容
            formatter: function (params) {
                const fullScreenColor = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#F59A3F;"></span>`; // WebGIS颜色
                const doubleScreenColor = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#F2C751;"></span>`; // 数据生产颜色
                const simpleScreenColor = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#296FFB;"></span>`; // 外业测绘颜色
                const lineScreenColor = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#4AA5EA;"></span>`; // 事业单位颜色
                const fullScreen = params[0]; // WebGIS序列
                const doubleScreen = params[1]; // 数据生产序列
                const simpleScreen = params[2]; // 外业测绘屏序列
                const lineScreen = params[3]; // 事业单位屏序列
                const bg = params[4]; // 背景区分联机与脱机
                const status =
                    bg.seriesName === '已升学'
                        ? `<span style="display:inline-block;color:#2087FE;">联机</span>`
                        : `<span style="display:inline-block;color:#DC3239;">脱机</span>`;
                return (
                    `${fullScreen.name}(${status})</br>` +
                    `${fullScreenColor}${fullScreen.seriesName}：${fullScreen.value}</br>` +
                    `${doubleScreenColor}${doubleScreen.seriesName}：${doubleScreen.value}</br>` +
                    `${simpleScreenColor}${simpleScreen.seriesName}：${simpleScreen.value}</br>` +
                    `${lineScreenColor}${lineScreen.seriesName}：${lineScreen.value}</br>`
                );
            },
        },
        grid: [
            {
                // 左边
                show: false,
                left: '2%',
                top: 40,
                bottom: 60,
                containLabel: true,
                width: '43%',
            },
            {
                // 中间
                show: false,
                left: '55%',
                top: 60,
                bottom: 60,
                width: '14%',
            },
            {
                // 右边
                show: false,
                right: '2%',
                top:40,
                bottom: 60,
                containLabel: true,
                width: '43%',
            },
        ],
        // X轴线配置
        xAxis: [
            {
                // 左侧区域
                gridIndex: 0, // x 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
                type: 'value', // 轴线类型: 数值轴
                position: 'top', // 轴线位置(此处位于顶部)
                inverse: true, // 是否是反向坐标轴.[ default: false ]
                axisLine: {
                    show: false, // 轴线不显示
                },
                axisTick: {
                    show: false, // 轴线刻度不显示
                },
                axisLabel: {
                    // 轴线刻度标签
                    show: true, // 显示刻度标签
                    textStyle: {
                        // 标签样式
                        color: '#153D7D64',
                        fontSize: 12,
                    },
                },
                splitLine: {
                    // 垂直于X轴的分隔线
                    show: true, // 显示分隔线
                    lineStyle: {
                        // 分隔线样式
                        color: '#153D7D64',
                        width: 1,
                        type: 'solid',
                    },
                },
                // 强制设置坐标轴分割间隔
                // interval: 50,
                // min: 0, // 最小值
                // max: 200 // 最大值
            },
            {
                // 中间区域
                gridIndex: 1,
                show: false, // 中间部分不显示X轴
            },
            {
                // 右侧区域
                gridIndex: 2,
                type: 'value',
                position: 'top',
                inverse: false, // 是否是反向坐标轴.[ default: false ]
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: '#153D7D64',
                        fontSize: 12,
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#153D7D64',
                        width: 1,
                        type: 'solid',
                    },
                },
                // 强制设置坐标轴分割间隔
                // interval: 50,
                // min: 0, // 最小值
                // max: 200 // 最大值
            },
        ],
        // Y轴线配置
        yAxis: [
            {
                // 左侧区域
                gridIndex: 0, // y 轴所在的 grid 的索引，默认位于第一个 grid。[ default: 0 ]
                type: 'category', // 轴线类型: 类目轴
                // 类目轴中 boundaryGap 可以配置为 true 和 false。默认为 true，这时候刻度只是作为分隔线，标签和数据点都会在两个刻度之间的带(band)中间。
                boundaryGap: true, // 坐标轴两边留白策略，类目轴和非类目轴的设置和表现不一样。
                inverse: true, // 是否是反向坐标轴.[ default: false ]
                position: 'right', // y轴的位置。'left' or 'right'
                axisLine: {
                    show: false, // y轴线不显示
                },
                axisTick: {
                    show: false, // y轴线刻度不显示
                    lineStyle: {
                        // 刻度线样式
                        color: '#11356D',
                    },
                },
                axisLabel: {
                    show: false, // 刻度标签不显示
                },
                data: myData, // Y轴(这里是类目轴)的类目数据
            },
            {
                gridIndex: 1, // 中间区域
                type: 'category',
                boundaryGap: true,
                inverse: true,
                position: 'left', // y轴的位置。'left' or 'right'
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                },
                axisLabel: {
                    show: true, // 显示中间部分的Y轴刻度标签(中间的文字)
                    textStyle: {
                        // 标签样式
                        color: '#cccccc',
                        fontSize: 12,
                    },
                },
                data: myData,
            },
            {
                // 右侧区域
                gridIndex: 2,
                type: 'category',
                boundaryGap: true,
                inverse: true,
                position: 'left',
                axisLine: {
                    show: false,
                },
                axisTick: {
                    show: false,
                    lineStyle: {
                        // 刻度线样式
                        color: '#153D7D',
                    },
                },
                axisLabel: {
                    show: false,
                },
                data: myData,
            },
        ],
        series: [
            {
                name: 'WebGIS', // 系列名称
                type: 'bar',
                // barGap: 5, // 柱间距离
                barWidth: 15, // 柱子宽度
                xAxisIndex: 0, // 对应在X轴的grid索引
                yAxisIndex: 0, // 对应在Y轴的grid索引
                stack: '1', // 相同就是堆叠
                // barGap:'-100%', //重叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#F59A3F',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#F59A3F',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 鼠标指向高亮
                    show: true,
                    label: {
                        color: '#F59A3F96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#F59A3F96', // 高亮状态下柱条颜色
                    },
                },
                data: offLine[0], // 系列中的数据内容数组
            },
            {
                name: '数据生产', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 0, // 对应在X轴的grid索引
                yAxisIndex: 0, // 对应在Y轴的grid索引
                stack: '1', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#F2C751',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#F2C751',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#F2C75196', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#F2C75196', // 高亮状态下柱条颜色
                    },
                },
                data: offLine[1], // 系列中的数据内容数组
            },
            {
                name: '外业测绘', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 0, // 对应在X轴的grid索引
                yAxisIndex: 0, // 对应在Y轴的grid索引
                stack: '1', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#296FFB',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#296FFB',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#296FFB96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#296FFB96', // 高亮状态下柱条颜色
                    },
                },
                data: offLine[2], // 系列中的数据内容数组
            },
            {
                name: '事业单位', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 0, // 对应在X轴的grid索引
                yAxisIndex: 0, // 对应在Y轴的grid索引
                stack: '1', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#4AA5EA',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#4AA5EA',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#4AA5EA96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#4AA5EA96', // 高亮状态下柱条颜色
                    },
                },
                data: offLine[3], // 系列中的数据内容数组
            },
            // 脱机背景
            {
                name: '已就业', // 系列名称
                type: 'bar',
                // barGap: 5, // 柱间距离
                barWidth: 21, // 柱子宽度
                xAxisIndex: 0, // 对应在X轴的grid索引
                yAxisIndex: 0, // 对应在Y轴的grid索引
                // stack: '1', // 相同就是堆叠
                barGap: '-120%', //重叠
                itemStyle: {
                    // 柱条样式。
                    // color: '#DC3239',
                    color: 'transparent',
                    borderWidth: 1,
                    borderColor: '#DC3239',
                    shadowColor: '#DC3239',
                    shadowBlur: 20,
                },
                emphasis: {
                    scale: false,
                },
                data: offLineSum, // 系列中的数据内容数组
            },

            {
                name: 'WebGIS', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 2, // 对应在X轴的grid索引
                yAxisIndex: 2, // 对应在Y轴的grid索引
                stack: '2', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#F59A3F',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#F59A3F',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 鼠标指向高亮
                    show: true,
                    label: {
                        color: '#F59A3F96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#F59A3F96', // 高亮状态下柱条颜色
                    },
                },
                data: onLine[0], // 系列中的数据内容数组
            },
            {
                name: '数据生产', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 2, // 对应在X轴的grid索引
                yAxisIndex: 2, // 对应在Y轴的grid索引
                stack: '2', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#F2C751',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#F2C751',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#F2C75196', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#F2C75196', // 高亮状态下柱条颜色
                    },
                },
                data: onLine[1], // 系列中的数据内容数组
            },
            {
                name: '外业测绘', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 2, // 对应在X轴的grid索引
                yAxisIndex: 2, // 对应在Y轴的grid索引
                stack: '2', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#296FFB',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#296FFB',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#296FFB96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#296FFB96', // 高亮状态下柱条颜色
                    },
                },
                data: onLine[2], // 系列中的数据内容数组
            },
            {
                name: '事业单位', // 系列名称
                type: 'bar',
                barWidth: 15, // 柱子宽度
                xAxisIndex: 2, // 对应在X轴的grid索引
                yAxisIndex: 2, // 对应在Y轴的grid索引
                stack: '2', // 相同就是堆叠
                label: {
                    show: true,
                    position: 'top',
                    color: '#4AA5EA',
                    fontSize: 10,
                },
                itemStyle: {
                    // 柱条样式。
                    color: '#4AA5EA',
                    // borderWidth:1,
                    // borderColor:'transparent'
                },
                emphasis: {
                    // 高亮
                    show: true,
                    label: {
                        color: '#4AA5EA96', // 高亮状态下柱条颜色
                    },
                    itemStyle: {
                        color: '#4AA5EA96', // 高亮状态下柱条颜色
                    },
                },
                data: onLine[3], // 系列中的数据内容数组
            },
            // 联机背景
            {
                name: '已升学', // 系列名称
                type: 'bar',
                // barGap: 5, // 柱间距离
                barWidth: 21, // 柱子宽度
                xAxisIndex: 2, // 对应在X轴的grid索引
                yAxisIndex: 2, // 对应在Y轴的grid索引
                // stack: '2', // 相同就是堆叠
                barGap: '-120%', //重叠
                itemStyle: {
                    // 柱条样式。
                    // color: '#2087FE',
                    color: 'transparent',
                    borderWidth: 1,
                    borderColor: '#2087FE',
                },
                data: onLineSum, // 系列中的数据内容数组
            },
        ],
    };
    r3ChartItem = echarts.init(proxy.$refs.r3);
    r3ChartItem.setOption(option, true);
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
        loadR1Chart();
        loadR2Chart();
        loadR3Chart();
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
        <TimeMap></TimeMap>
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
            <div class="LabelContent" style="margin-top: 2vh"><span class="title-ellipsis">
                    2023地信学院毕业生去向
                </span></div>
            <div class="r1" ref="r1">
            </div>
            <div class="LabelContent"><span class="title-ellipsis">
                    2023地信学院毕业生生源地
                </span></div>
            <div class="r2" ref="r2"></div>
            <div class="LabelContent"><span class="title-ellipsis"></span></div>
            <div class="r3" ref="r3">
            </div>
        </div>
    </div>

</template>
<style scope lang="less">
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
}
</style>
