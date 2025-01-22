<!--
 * @Author: liqifeng
 * @Date: 2025-01-21 14:07:20
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-22 17:08:38
 * @Description: 
-->
<template>
    <div id="threedmap">
        <div id="viewDiv" ref="mapView"></div>
        <div class="timeSlider"></div>
        <div id="timeSlidercontainer" :style="'width:'+(timeLineList.length*8+8)+'vh;'">
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
        <div class="header">
            <div class="headerBG">
                <div class="background-left"></div>
                <div class="background-right"></div>
            </div>
            <div class="light"></div>
            <!-- <img src="./assets/logo_s.png" id="fylogoimg" /> -->
            <div class="title">
                <span class="title-ch">高校毕业生去向统计分析系统</span>
                <span class="title-en">Graduate Destination Analysis System</span>
            </div>
            <div class="rightMenu">
                <div :class="['item', MenuIndex == item.path ? 'active' : '']" @click="menuClick(item)"
                    v-for="(item, index) in MenuList" :key="index">
                    {{ item.title }}
                </div>
            </div>
            <!-- 用户 -->
            <el-dropdown trigger="click" popper-class="UserPop">
                <span class="el-dropdown-link">
                    <img src="./assets/admin.svg" alt="" style="margin-bottom: -0.3vh;" />
                    <span>{{ "管理员" }}</span>
                    <img src="/img/icon/arrowdown.png" style="width: 2vh;height: 2vh;background-size: 100% 100%;"
                        alt="">
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item><img src="./assets/system.svg" alt="" />
                            <span>后台管理</span></el-dropdown-item>
                        <el-dropdown-item><img src="./assets/logout.svg" alt="" /> <span>退出登陆</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
            <img class="trackline" src="./assets/guangyun.png" :style="'left:' + tracklineleft + '%;'" />
        </div>
        <DateWeather></DateWeather>

        <router-view></router-view>
    </div>
</template>

<script setup>
import DateWeather from "./components/DateWeather/index.vue";
import Bus from "@/buss/eventBus";
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
import WMSLayer from '@arcgis/core/layers/WMSLayer';
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';

const loginStore = useLoginStore();
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
// 设置语言为中文
esriConfig.locale = 'zh';
const router = useRouter();
const { proxy } = getCurrentInstance();
let tracklineani = -1;
const tracklineleft = ref(0);
const tracklinetotalsec = 6;
const mapView = ref(null);
let timeSlider = null;
const timeLineList = ref([2001, 2002, 2003, 2004, 2005, 2006]);
const currentYear = ref(null);
// 选择年份
function chooseyaer(item) {
    currentYear.value = item;
    if (timeSlider) {
        timeSlider.timeExtent = {
            start: new Date(currentYear.value, 0, 1),
            end: new Date(currentYear.value, 12, 31),
        }
    }
}
const MenuList = [
    {
        title: "数据面板",
        path: "/home/datapanel",
    },
    {
        title: "数据分析",
        path: "/home/analysis",
    },
    {
        title: "数据展示",
        path: "/home/display",
    },
    {
        title: "数据管理",
        path: "/home/manage",
    }
];
function menuClick(item) {
    router.push(item.path);
    MenuIndex.value = item.path;
}
function ontrackanitick(a) {
    if (ontrackanitick.time == null) {
        ontrackanitick.time = a;
    }
    const elapse = a - ontrackanitick.time;
    const sec = elapse / 1000;

    tracklineleft.value = ((sec % tracklinetotalsec) / tracklinetotalsec) * 100;
    tracklineleft.value = remap(tracklineleft.value, 0, 100, -10, 90);
    requestAnimationFrame(ontrackanitick);
}
function remap(x, a, b, c, d) {
    return ((x - a) / (b - a)) * (d - c) + c;
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
    const view = new MapView({
        container: mapView.value,
        map: webMap,
        center: [116.3974, 39.9093], // 设置初始中心点
        zoom: 5,
        constraints: {
            minZoom: 3, // 最小缩放级别
            maxZoom: 15 // 最大缩放级别
        }
    });
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
    view.when(() => {
        console.log('Map and View are ready');
    }, (error) => {
        console.error('Map and View failed to load:', error);
    });
    const featureLayer = new FeatureLayer({
        url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Earthquakes_Since1970/MapServer',
    });

    webMap.add(featureLayer);
    timeSlider = new TimeSlider({
        container: 'timeSlider', // 时间轴的容器
        view: view,
        mode: 'time-window',
        fullTimeExtent: {
            start: new Date(1970, 0, 1),
            end: new Date(),
        },
        timeExtent: {
            start: new Date(2009, 0, 1),
            end: new Date(2010, 0, 1),
        },
        stops: {
            interval: {
                value: 1,
                unit: 'years',
            },
        },
    });
    // setTimeout(() => {
    //     timeSlider.timeExtent = {
    //         start: new Date(1970, 0, 1),
    //         end: new Date(2010, 0, 1),
    //     }
    // }, 5000);
    timeSlider.watch('timeExtent', (timeExtent) => {
        // 当时间轴变化时，更新图层的时间过滤条件
        featureLayer.timeExtent = timeExtent;
    });
    // 将时间轴添加到视图
    view.ui.add(timeSlider, 'bottom-center');
}

onUnmounted(() => {
    if (tracklineani > -1) {
        cancelAnimationFrame(tracklineani);
        tracklineani = -1;
    }
});
onBeforeMount(() => {

});

onMounted(() => {
    requestAnimationFrame(ontrackanitick);
    initmap();
    if (MenuList.length > 0) {
        MenuIndex.value = MenuList[0].path;
        router.push(MenuList[0].path);
    }
});
</script>
<style lang="less">
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
    border-radius: 0.3vh;
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
    padding-top: 1vh;
    font-size: 1.4vh;
    letter-spacing: 0.3vh;
    text-align: center;
    font-family: puhui_Medium_65;
}

.ul_box {
    margin-top: 2vh;
}

.my_timeline {
    /* width: 48vh; */
    min-width: 20vh;
    margin: 1vh 2vh 0px;
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
<style lang="less" scoped>
#threedmap,
#viewDiv {
    // width: 4992px !important;
    // height: 2600px !important;
    width: 100%;
    height: 100%;
    overflow-y: hidden;
    overflow-x: hidden;
    background: #1a4061;
    position: absolute;

    #CopyrightInformation {
        position: absolute;
        z-index: 999;
        // background: #091426e5;
        background: linear-gradient(to right, #091426, #091426e5);
        width: 100%;
        height: 3vh;
        bottom: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: puhui_Regular_55;
        font-size: 1.4vh;
        color: #dedcdc;
    }
}

#threedmap {
    .header {
        .light {
            position: absolute;
            z-index: 99;
            height: 5vh;
            width: 30vh;
            left: 6vh;
            top: 4.5vh;
            background: url("./assets/light.png") no-repeat;
            background-size: 100% 100%;
            cursor: none;
            pointer-events: none;
            display: none;
            left: 1vh;
        }

        .headerBG {
            position: absolute;
            z-index: -1;
            height: 100%;
            width: 100%;
            left: 0;
            top: 0;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;

            .background-left,
            .background-right {
                height: 100%;
                /* 与容器高度一致 */
                background-repeat: no-repeat;
            }

            .background-left {
                width: 80vh;
                height: 100%;
                background-image: url(./assets/HeaderL.png);
                background-size: 100% 100%;
            }

            .background-right {
                width: 43vh;
                height: 1vh;
                background-image: url("./assets/HeaderR.png");
                background-size: 100% 100%;
            }
        }

        .trackline {
            position: absolute;
            /*height:3vh;*/
            /*width:auto;*/
            height: 4vh;
            /*width:36vh;*/
            width: 50vh;
            top: 2vh;
            top: 5vh;
            /*top:7vh;*/
            /*opacity:0.8;*/
        }

        // background: url("./assets/title.png") no-repeat;
        // background: #07152fcc;
        background: linear-gradient(to right, #07152f, #07152fcc);
        background-size: 100% 100%;
        width: 100%;
        height: 7.8vh;
        height: 7vh;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1100;
        text-align: center;

        #fylogoimg {
            position: absolute;
            width: 5vh;
            top: 2vh;
            left: 2vh;
        }

        .title {

            // background: url("./assets/title.png");
            img {
                width: 32vh;
            }

            span {
                display: block;
            }

            .title-en {
                font-size: 1.2vh;
            }

            height: 100%;
            /*line-height: 3.2vh;*/
            font-size: 2.8vh;
            font-family: puhui_ExtraBold_95;
            color: #fff;
            /*letter-spacing: 0.7vh;*/
            // margin-top: 2vh;
            z-index: 999;
            /*display: flex;*/
            align-items: center;
            float: left;
            margin-left: 10vh;
            text-shadow: 0.3vh 0 0.3vh rgba(39, 132, 238, 0.8);

            margin-left: 12vh;

            .title-ch {
                margin-top: 0.4em;
            }

            .title-en {
                font-weight: lighter;
                font-family: "puhui_Regular_55";
                text-transform: capitalize;
                letter-spacing: 0.4em;
                font-size: 0.8vh;
                margin-top: -0.2em;
                opacity: 0.9;
                text-align: center;
            }
        }

        .leftMenu {
            position: absolute;
            left: 28vh;
            top: 1.5vh;
            height: 3.8vh;

            .item {
                cursor: pointer;
                width: 14vh;
                height: 3.8vh;
                line-height: 3.8vh;
                color: #fff;
                float: left;
                background: url("./assets/menu_bg.png") no-repeat;
                background-size: 100% 100%;
                font-size: 1.6vh;
                font-family: puhui_SemiBold_75;
                margin-right: 3.5vh;

                &.active {
                    background: url("./assets/menu_hover.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

        .rightMenu {
            position: absolute;
            /*right: 15vh;*/
            left: 57vh;
            top: 1.5vh;
            height: 3.8vh;

            .item {
                cursor: pointer;
                width: 14vh;
                height: 3.8vh;
                width: 16vh;
                line-height: 3.8vh;
                color: #fff;
                float: left;
                background: url("./assets/menu_bgr.png") no-repeat;
                background-size: 100% 100%;
                font-size: 1.6vh;
                font-family: puhui_SemiBold_75;
                /*margin-right: 2vh;*/
                margin-right: 4vh;

                &.active {
                    background: url("./assets/menu_hoverr.png") no-repeat;
                    background-size: 100% 100%;
                }
            }
        }

        :deep(.el-dropdown) {
            position: absolute;
            pointer-events: auto;
            right: 2vh;
            top: 2.5vh;
            z-index: 11;

            img {
                width: 2vh;
                margin-right: 1vh;
                height: 2vh;
                margin-top: -0.4vh;
            }

            span {
                color: #fff;
                font-size: 1.6vh;
                display: flex;
                align-items: center;
            }
        }
    }
}

.menuitemicon {
    width: 1.8vh !important;
    height: 1.8vh !important;
    margin-right: 0.5vh;
    margin-top: -0.2vh;
    // background-color: #fff !important;
}

.menulist {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    margin-left: 15.5vh;
    height: 5.8vh;
    /* margin-bottom: 0.83vh; */
    align-items: flex-end;

    :deep(.el-menu) {
        border: 0 !important;
        height: auto;
        --el-menu-hover-bg-color: rgba(0, 0, 0, 0);

        // margin: 0 2.25vh;
        .menuitemname {
            width: 14vh;
            height: 3.31vh;
            margin: 0 2.25vh;
            --el-menu-hover-bg-color: rgba(0, 0, 0, 0);
        }

        .el-sub-menu {
            width: 14vh;
            height: 3.31vh;
            // background: url("./assets/default.png") no-repeat;
            // background-size: 100% 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 2.2vh;
            text-align: center;

            &:hover {
                // background: url("./assets/active.png") 0 0 no-repeat;
                // background-size: 100% 100%;
            }

            .el-sub-menu .el-sub-menu__icon-arrow {
                width: 0 !important;
                height: 0 !important;
                overflow: hidden;
                position: absolute;
            }

            .el-icon {
                visibility: hidden;
                width: 0 !important;
                height: 0 !important;
                position: absolute;
            }

            :deep(.el-sub-menu__icon-arrow) {
                visibility: hidden;
                width: 0 !important;
                height: 0 !important;
                position: absolute;
            }

            .el-sub-menu__title {
                padding: 0 !important;
            }
        }

        .el-menu-item {
            width: 14vh;
            height: 3.31vh;
            // background: url("./assets/default.png") no-repeat;
            // background-size: 100% 100%;
            // margin: 0 2.25vh;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: puhui_SemiBold_75;
            font-size: 2vh;
            text-align: center;

            &:hover {

                // background: url("./assets/active.png") 0 0 no-repeat;
                // background-size: 100% 100%;
                span {
                    color: #7aecf1 !important;
                }
            }

            span {
                font-size: 2vh;
                color: #ffffffde;
            }
        }

        .el-menu-item:hover {
            background-color: transparent !important;
        }

        &.is-active {
            color: #7aecf1 !important;
        }
    }

    .MenuPop {
        .el-menu-item {
            text-align: center;
            padding: 0;

            span {
                font-size: 1.8vh;
                display: inline-block;
                padding: 0;
                width: 100%;
            }
        }

        &.el-popper.is-light {
            background: transparent;
            border: none;
        }

        :deep(.el-menu-item) {
            background-color: transparent;
        }

        .el-menu--popup {
            width: 11vh;
            padding: 0 0 0 0;
            min-width: 0;
            background: rgba(0, 0, 0, 0.7);
            margin-bottom: 1vh;
        }
    }

    .el-sub-menu__title span {
        font-family: puhui_SemiBold_75;
        font-size: 2vh;
        color: #ffffff;

        &:hover {
            color: #7aecf1 !important;
        }
    }

    :deep(.el-sub-menu__title:hover) {
        background-color: transparent;
        color: #7aecf1 !important;
    }
}
</style>
<style lang="less">
.MenuPop {
    transform: translateX(-0.2vh) translateY(-5px);
    width: 10.7vh;
    border: 1px solid #174973;

    .el-menu-item {
        text-align: center;
        padding: 0;

        span {
            font-size: 1.4vh;
            font-family: puhui_Regular_85;
            display: inline-block;
            padding: 0;
            width: 100%;
        }
    }

    &.el-popper.is-light {
        background: transparent;
        border: none;
    }

    .el-menu--popup {
        width: 11vh;
        padding: 0 0 0 0;
        min-width: 0;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 0 !important;
        --el-menu-hover-bg-color: #009adc !important;

        .menuitemname {
            color: #ffffff;

            .el-sub-menu {
                .el-sub-menu__title {
                    padding: 0;
                    color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        background-color: #009adc !important;
                    }

                    span {
                        font-size: 1.4vh;
                        font-family: puhui_Regular_85;
                        padding: 0;
                    }
                }

                .el-popper.is-light {
                    transform: translateX(-0.45vh) translateY(0);
                    background: transparent;
                    border: 1px solid #174973;
                    border-radius: 0 !important;
                }
            }

            &:hover {
                background-color: turquoise !important;
            }

            .el-menu-item {
                color: #ffffff;
            }

            .el-icon {
                visibility: hidden;
                height: 0 !important;
                width: 0 !important;
            }

            .el-menu--horizontal .el-menu .el-sub-menu__title {
                padding: 0;
            }

            .el-menu--horizontal .el-menu .el-menu-item,
            .el-menu--horizontal .el-menu .el-sub-menu__title {
                padding: 0;
            }
        }
    }
}

.UserPop {
    background: url("./assets/pop.png") no-repeat !important;
    background-size: 100% 100% !important;
    border: none !important;
    transform: translateY(0.7vh);

    .el-popper__arrow {
        display: none;
    }

    .el-dropdown-menu {
        background: transparent;
        padding: 0;

        .el-dropdown-menu__item {
            background: transparent;

            img {
                width: 2vh;
                margin-right: 1vh;
            }

            span {
                color: #fff;
                font-size: 1.4vh;
            }

            &:hover {
                background: url("./assets/pop-select.png") no-repeat !important;
                background-size: 100% 100% !important;
            }
        }
    }
}

.el-icon--right {
    top: 0.3vh;
}
</style>