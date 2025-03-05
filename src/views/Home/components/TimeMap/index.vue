<template>
    <div id="time-map">
        <div id="viewDiv" ref="mapView"></div>
        <div class="timeSlider"></div>
        <div id="timeSlidercontainer" :style="'width:' + (timeLineList.length * 8 + 8) + 'vh;'">
            <div id="dhTitle">滁州学院 地理信息与旅游学院毕业生{{ selectname }}变化图
                <div class="dataselect">
                    <a-select class="r3select" ref="select" v-model:value="tasktvalue" allowClear :placeholder="'生源地'"
                        @change="handleChange">
                        <a-select-option v-for="(item, index) in taskstatus" :value="item.value" :key="index">{{
                            item.name }}
                        </a-select-option>
                    </a-select>
                </div>
            </div>
            <div class="ul_box">
                <ul class="my_timeline" ref="mytimeline">
                    <li class="my_timeline_item" v-for="(item, index) in timeLineList" :key="index"
                        @click="chooseyaer(item)">
                        <div class="my_timeline_item_line_front"></div>
                        <!--圈圈节点-->
                        <div class="my_timeline_node">
                            <div :class="item == currentYear ? 'timeline_selected' : ''" :id="item"></div>
                        </div>
                        <!--线-->
                        <div class="my_timeline_item_line_back"></div>
                        <!--标注-->
                        <div
                            :class="item == currentYear ? 'my_timeline_item_content active' : 'my_timeline_item_content'">
                            {{ item }}</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, getCurrentInstance } from "vue";
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import TileLayer from '@arcgis/core/layers/TileLayer';
import WebTileLayer from '@arcgis/core/layers/WebTileLayer';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import VectorTileLayer from '@arcgis/core/layers/VectorTileLayer';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer"
import TimeSlider from '@arcgis/core/widgets/TimeSlider';
import esriConfig from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import Compass from '@arcgis/core/widgets/Compass';
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';
const loginStore = useLoginStore();
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
esriConfig.locale = 'zh';
const router = useRouter();
const { proxy } = getCurrentInstance();
const mapView = ref(null);
let timeSlider = null;
const timeLineList = ref([2018, 2019, 2020, 2021, 2022, 2023, 2024]);
const currentYear = ref(null);
const selectname = ref(null);
const tasktvalue = ref('0');
const featureLayer = ref(null);
const view = ref(null);
const taskstatus = [
    {
        name: '就业地',
        value: '0',
        url: 'http://localhost:6080/arcgis/rest/services/Locationoftheunit/MapServer',
    },
    {
        name: '生源地',
        value: '1',
        url: 'http://localhost:6080/arcgis/rest/services/Placeoforigin/MapServer',
    },
];
function chooseyaer(item) {
    currentYear.value = item;
    if (timeSlider) {
        timeSlider.timeExtent = {
            start: new Date(currentYear.value, 0, 1),
            end: new Date(currentYear.value, 12, 31),
        }
    }
}
function handleChange(value) {
    debugger;
    selectname.value = taskstatus.find(item => item.value === value).name;
    addTimeMap(taskstatus.find(item => item.value === value));
}
function initmap() {
    const map = new Map({
        basemap: 'streets-night-vector',
    });
    const webMap = new WebMap({
        portalItem: {
            id: '1211472e6c3d45fe95793af7ad7d3d89' // 替换为实际的 portalId
        }
    });
    webMap.load();
    let viewer = new MapView({
        container: mapView.value,
        map: webMap,
        center: [116.3974, 39.9093], // 设置初始中心点
        zoom: 5,
        constraints: {
            minZoom: 3, // 最小缩放级别
            maxZoom: 15 // 最大缩放级别
        }
    });
    view.value = viewer;
    // const wmtLayer = new WMSLayer({
    //     url: "http://localhost:6080/arcgis/services/2020生源地/MapServer/WMSServer",
    //     sublayers: [
    //         {
    //             name: "行政边界数据", // 替换为实际图层名称
    //             visible: true,
    //         },
    //         {
    //             name: "行政边界_省级",
    //             visible: true,
    //         }
    //     ],
    //     spatialReference: { wkid: 4326 }, // 坐标系
    //     // version: "1.3.0" // WMS 版本
    // });

    // map.add(wmtLayer);
    view.value.when(() => {
        console.log('Map and View are ready');
    }, (error) => {
        console.error('Map and View failed to load:', error);
    });
    
    let layer = new FeatureLayer({
        id: '就业地',
        url: 'http://localhost:6080/arcgis/rest/services/Locationoftheunit/MapServer',
        // url: 'http://localhost:6080/arcgis/rest/services/Placeoforigin/MapServer',
    });
    featureLayer.value = layer;
    viewer.map.add(layer);
    setTimeout(() => {
        timeSlider = new TimeSlider({
            container: 'timeSlider', // 时间轴的容器
            view: viewer,
            mode: 'time-window',
            fullTimeExtent: {
                start: new Date(1970, 0, 1),
                end: new Date(),
            },
            timeExtent: {
                start: new Date(1920, 0, 1),
                end: new Date(2024, 12, 31),
            },
            stops: {
                interval: {
                    value: 1,
                    unit: 'years',
                },
            },
        });
        viewer.ui.add(timeSlider, 'bottom-center');
        setTimeout(() => {
            timeSlider.watch('timeExtent', (extent) => {
                if (featureLayer.value) {
                    featureLayer.value.timeExtent = extent;
                    // console.log(featureLayer.value,extent);

                }
                // featureLayer.value.timeExtent = extent;
            });
        }, 200);
        // view.value.ui.add(timeSlider, 'bottom-center');
    }, 200);
    setTimeout(() => {
        currentYear.value = timeLineList.value[0];
    }, 200);
}
function addTimeMap(item) {
    if (view.value) {
        // 检查图层是否存在于地图中
        taskstatus.forEach((item) => {
            if (view.value.map.findLayerById(item.name)) {
                view.value.map.remove(view.value.map.findLayerById(item.name));
            }
        });
        featureLayer = null;
    }
    featureLayer.value = new FeatureLayer({
        id: item.name,
        url: item.url,
    });
    view.value.map.add(featureLayer);
}
onMounted(() => {
    initmap();
    currentYear.value = timeLineList.value[0];
});
</script>

<style lang="less">
.time-map {
    position: relative;
    width: 100%;
    height: 100%;
}

#viewDiv {
    // width: 4992px !important;
    // height: 2600px !important;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background: #1a4061;
    position: absolute;
}

#timeSlider {
    position: absolute;
    left: 45%;
    /* right: 50px; */
    bottom: 20px;
    height: 40px;
    width: 500px;
    z-index: -10;
    background-color: white;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

#timeSlidercontainer {
    overflow: hidden;
    height: 10vh;
    position: absolute;
    background: #031420;
    border-radius: 0.2.5vh;
    bottom: 3%;
    pointer-events: auto;
    z-index: 100;
    left: 0;
    right: 0;
    margin: auto;
}

.ul-box {
    display: inline-block;
    // width: 100%;
    bottom: 1%;
}

.my_timeline_item {
    display: inline-block;
    width: 8vh;
}

.my_timeline_node {
    box-sizing: border-box;
    border-radius: 50%;
    cursor: pointer;
    color: #1183c1;
    width: 0.8vh;
    height: 0.8vh;
    border: 0.01vh solid #1183c1;
    margin-left: calc((100% - 0.8vh) / 2);
    position: relative;
}

.my_timeline_item_line_front {
    border-top: 1px solid #1183c1;
    width: calc((100% - 0.8vh) / 2);
    float: left;
    margin-top: 0.4vh;
}

.my_timeline_item_line_back {
    border-top: 1px solid #1183c1;
    width: calc((100% - 0.8vh - 2px) / 2);
    float: right;
    margin-top: -0.4vh;
}

.my_timeline_item_content {
    color: rgba(255, 255, 255, 0.8);
    font-weight: lighter;
    margin-left: 2.4vh;
    font-size: 1.4vh;
    font-family: puhui_Medium_65;
    margin-top: 0.5vh;
    font-family: puhui_Medium_65;

    &.active {
        color: #1183c1;
    }
}

#dhTitle {
    color: #fff;
    padding-top: 1.2vh;
    font-size: 1.4vh;
    letter-spacing: 0.2.5vh;
    text-align: center;
    font-family: puhui_Medium_65;

    .dataselect {
        letter-spacing: 0vh;
        position: absolute;
        right: 1vh;
        top: 1vh;

        .r3select {
            background: transparent;
            // border: 1px solid #4d7bc7;
            color: #fff;
            width: 10vh;
            height: 2.5vh;
            font-size: 1vh;
        }

        .ant-select-dropdown {
            border: 1px solid #4d7bc7;
            background-color: #1b273780 !important;
        }

        .ant-empty-small {
            color: #f56a00;
        }

        .ant-select {
            .ant-select-selection-placeholder {
                color: #fff !important;
                font-size: 1.2vh !important;
                line-height: 2.2vh !important;
            }

            .ant-select-clear {
                background: transparent !important;
            }

            .ant-select-selector {
                width: 10vh !important;
                height: 2.5vh !important;
                background-color: #ffffff00 !important;
                border: 1px solid #2a579ab0 !important;
                color: aliceblue;
                font-size: 1.2vh !important;

                .ant-select-selection-search-input {
                    height: 2.5vh !important;
                    display: flex !important;
                }

                .ant-select-selection-item {
                    color: #fff !important;
                    font-size: 1.2vh !important;
                    line-height: 2.2vh !important;
                }
            }

            .ant-select-arrow {
                color: #4d7bc7 !important;
            }
        }

        .ant-select-item-option {
            background: transparent !important;
            background-color: transparent !important;
            color: #fff !important;
            font-size: 1.2vh !important;
            // height: 1.5vh !important;
        }

        .ant-select-item-option-selected {
            background: transparent !important;
            color: #fff !important;
            height: 1.5vh !important;
        }

        .ant-select-item-option-active {
            background: #0f81b7 !important;
        }
    }


}

.ant-select-dropdown {
    border: 1px solid #4d7bc7;
    background-color: #1b2737 !important;
}


.ant-select {
    .ant-select-selection-placeholder {
        color: #fff !important;
        font-size: 1.2vh !important;
        line-height: 2.2vh !important;
    }

    .ant-select-clear {
        background: transparent !important;
    }

    .ant-select-selector {
        height: 2.5vh !important;
        background-color: #ffffff00 !important;
        border: 1px solid #2a579ab0 !important;
        color: aliceblue;
        font-size: 1.2vh !important;

        .ant-select-selection-search-input {
            height: 2.5vh !important;
            display: flex !important;
        }

        .ant-select-selection-item {
            color: #fff !important;
            font-size: 1.2vh !important;
            line-height: 2.2vh !important;
        }
    }

    .ant-select-arrow {
        color: #4d7bc7 !important;
    }
}

.ant-select-item-option {
    background: transparent !important;
    background-color: transparent !important;
    color: #fff !important;
    font-size: 1.2vh !important;
}

.ant-select-item-option-selected {
    background: transparent !important;
    color: #fff !important;
}

.ant-select-item-option-active {
    background: #0f81b7 !important;
}

.ul_box {
    margin-top: 1vh;
    display: flex;

}

.my_timeline {
    /* width: 48vh; */
    min-width: 20vh;
    margin: 1vh -1vh 0px;
    display: flex;
    justify-content: center;
}

.timeline_selected {
    display: block;
    border-radius: 50%;
    width: 0.4vh;
    height: 0.4vh;
    border: 0;
    background-color: #1183c1;
    position: absolute;
    top: 0.15vh;
    left: 0.15vh;
}
</style>