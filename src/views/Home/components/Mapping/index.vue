<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-23 17:21:38
 * @Description:
-->
<script setup>
import Bus from "@/buss/eventBus";
import { ref, onMounted, reactive, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, getCurrentInstance } from "vue";
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Basemap from '@arcgis/core/Basemap';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import esriConfig from '@arcgis/core/config';
import WebMap from '@arcgis/core/WebMap';
import WMSLayer from '@arcgis/core/layers/WMSLayer';

esriConfig.locale = 'zh';
const { proxy } = getCurrentInstance();
const loginStore = useLoginStore();
const view = ref(null);
const mapView = ref(null);
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
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
const formState = reactive({
    name: '',
    region: undefined,
    date1: undefined,
    delivery: false,
    type: [],
    resource: '',
    desc: '',
    direction: '',
});
const onSubmit = () => {
    console.log('submit!', toRaw(formState));
};
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
    view.value = new MapView({
        container: mapView.value,
        map: webMap,
        center: [116.3974, 39.9093], // 设置初始中心点
        zoom: 5,
        constraints: {
            minZoom: 3, // 最小缩放级别
            maxZoom: 15 // 最大缩放级别
        }
    });
}
onMounted(() => {
    if (MenuIndex.value == "/home/mapping") {
        initmap();
    }

});
</script>
<template>
    <div class="Main">
        <div id="viewDiv" ref="mapView"></div>
        <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
            <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
            <div class="LabelContent" style="margin-top: 2vh"> <span class="title-ellipsis">版式布局</span> </div>
            <div class="l1">
                <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
                    <!-- <a-form-item label="Activity name">
                        <a-input v-model:value="formState.name" />
                    </a-form-item> -->
                    <a-form-item label="Activity zone">
                        <a-select v-model:value="formState.region" placeholder="please select your zone">
                            <a-select-option value="shanghai">Zone one</a-select-option>
                            <a-select-option value="beijing">Zone two</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="Activity type">
                        <a-checkbox-group v-model:value="formState.type">
                            <a-checkbox value="1" name="type">Online</a-checkbox>
                            <a-checkbox value="2" name="type">Promotion</a-checkbox>
                            <a-checkbox value="3" name="type">Offline</a-checkbox>
                        </a-checkbox-group>
                    </a-form-item>
                    <a-form-item label="Activity zone">
                        <a-select v-model:value="formState.region" placeholder="please select your zone">
                            <a-select-option value="shanghai">Zone one</a-select-option>
                            <a-select-option value="beijing">Zone two</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item label="页面方向">
                        <a-radio-group v-model:value="formState.direction">
                            <a-radio value="1">横向</a-radio>
                            <a-radio value="2">纵向</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-form>
            </div>
            <div class="LabelContent"><span class="title-ellipsis">地图要素</span></div>
            <div class="l2">
            </div>
            <div class="LabelContent"><span class="title-ellipsis">出图设置</span></div>
            <div class="l3" ref="l3">
            </div>
        </div>
    </div>

</template>

<style lang="less">
.ant-form label {
    font-size: 1.2vh !important;
    color: #FFF !important;
}
.ant-input {
    color: #FFF;
    font-size: 1.2vh !important;
    background: transparent !important;
    border-color: #2a579ab0 !important;
}

.ant-form-item {
    margin-bottom: 40px;
}
</style>
<style lang="less" scoped>
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
.Main {
    .l1,
    .l2,
    .l3 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        color: #fff;
        font-size: 1.2vh;
        align-items: center;
        padding: 3vh;
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
