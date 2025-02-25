<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-02-25 15:22:14
 * @Description:
-->
<script setup>
import Bus from "@/buss/eventBus";
import {
  ref,
  onMounted,
  reactive,
  onUnmounted,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onUpdated,
  watch,
  getCurrentInstance,
} from "vue";
import useLoginStore from "@/store/login.js";
import { storeToRefs } from "pinia";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import MapImageLayer from '@arcgis/core/layers/MapImageLayer';
import Basemap from "@arcgis/core/Basemap";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import esriConfig from "@arcgis/core/config";
import WebMap from "@arcgis/core/WebMap";
import WMSLayer from "@arcgis/core/layers/WMSLayer";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Compass from "@arcgis/core/widgets/Compass";
import ScaleRangeSlider from "@arcgis/core/widgets/ScaleRangeSlider";
import Zoom from "@arcgis/core/widgets/Zoom";
import { fi } from "element-plus/es/locales.mjs";

esriConfig.locale = "zh";
const { proxy } = getCurrentInstance();
const loginStore = useLoginStore();
let view = null;
const mapView = ref(null);
const activeKey = ref(false);
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
// 左边列表折叠按钮
function leftPanelClick() {
  leftCollapse.value = !leftCollapse.value;
  rightCollapse.value = !rightCollapse.value;
}
const formState = reactive({
  type: "聚类分析",
  timerange: "",
  data: "就业地",
  field: "就业数量",
});
const fieldList = ref(["就业数量", "生源数量"]);
const typeList = ref(["标准差椭圆分析", "聚类分析", "空间自相关分析", "核密度分析", "冷热点分析"]);
const dataList = ref(["生源地", "就业地"]);
const plainOptions = ref([]);
const checkedList = [
  {
    label: "2024毕业生生源地分析图",
    value: 'http://localhost:6080/arcgis/rest/services/2020生源地/MapServer/0'
  },
  {
    label: "2023毕业生生源地分析图",
    value: "2022",
  },
  {
    label: "2022毕业生生源地分析图",
    value: "2022",
  },
  {
    label: "2021毕业生生源地分析图",
    value: "2021",
  },
];
const showLayerList = ref([]);
// const formState.size = ref('A4')
// const formState.direction = ref('portrait')


function initmap() {
  const webMap = new WebMap({
    portalItem: {
      id: "1211472e6c3d45fe95793af7ad7d3d89", // 替换为实际的 portalId
    },
  });
  webMap.load();
  view = new MapView({
    container: mapView.value,
    map: webMap,
    center: [116.3974, 39.9093], // 设置初始中心点
    zoom: 5,
    constraints: {
      minZoom: 3, // 最小缩放级别
      maxZoom: 15, // 最大缩放级别
    },
  });

  view.when(() => {
    var compass = new Compass({
      view: view,
    });
    // 将指南针添加到MapView的左上角
    view.ui.add(compass, "top-left");
    // const scaleBar = new ScaleBar({
    //     view: view,
    //     unit: "metric", // 使用公制单位
    //     style: "bar", // 设置为 "ruler" 样式
    //     container: document.createElement("div")
    // });
    // view.ui.add(scaleBar, "top-left");
  });
}

function toolClick() {
  activeKey.value = !activeKey.value;
}
const loadedLayers = {};
function changeLayer(checkedValues) {
  Object.keys(loadedLayers).forEach((value) => {
    if (!checkedValues.includes(value)) {
      loadedLayers[value].visible = false;
      // 从显示列表中移除
      const index = showLayerList.value.findIndex((l) => l.name === value);
      if (index > -1) showLayerList.value.splice(index, 1);
    }
  });
  // 2. 处理需要显示的图层
  checkedValues.forEach((value) => {
    if (!loadedLayers[value]) {
      let feature = new FeatureLayer({
        url: value,
      });
      view.map.add(feature);

      loadedLayers[value] = feature;
      // 添加到显示列表
      showLayerList.value.push({
        name: value,
        layer: feature,
      });
    } else {
      // 显示已存在的图层
      loadedLayers[value].visible = true;
      // 确保在显示列表中
      if (!showLayerList.value.some((l) => l.name === value)) {
        showLayerList.value.push({
          name: value,
          layer: loadedLayers[value],
        });
      }
    }
  });

  // console.log(checkedValues,"loadedLayers:",loadedLayers,"showLayerList:",showLayerList.value);
  // let feature = new WMSLayer({
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
  // view.map.add(feature);
  // showLayerList.value.push(
  //     {
  //         name:checkedValue,
  //         layer:feature
  //     }
  // )
}
function close() {
  activeKey.value = false;
}
onMounted(() => {
  if (MenuIndex.value == "/home/analysis") {
    initmap();
    // setTimeout(() => {
    //     paperSizes.value = Object.keys(paperDimensions)
    // }, 0);
  }
});
</script>
<template>
  <div class="Mapping">
    <div id="mappingview" ref="mapView"></div>
    <div :class="['FlyPanel']">
      <!-- <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div> -->
      <div class="title">
        <span>时空分析</span>
        <img src="./assets/indent.svg" class="close" />
      </div>
      <div class="container">
        <div class="content">
          <div class="LabelContent" style="margin-top: 2vh">
            <span class="title-ellipsis">分析类型选择</span>
          </div>
          <div class="l1">
            <a-form :model="formState">
              <a-form-item label="分析类型">
                <a-select v-model:value="formState.type" style="width: 100%;" placeholder="">
                  <a-select-option v-for="(item, index) in typeList" :value="item" :key="index">{{ item
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="分析对象">
                <a-select v-model:value="formState.data" style="width: 100%;" placeholder="">
                  <a-select-option v-for="(item, index) in dataList" :value="item" :key="index">{{ item
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="分析字段">
                <a-select v-model:value="formState.field" style="width: 100%;" placeholder="">
                  <a-select-option v-for="(item, index) in fieldList" :value="item" :key="index">{{ item
                  }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="时间范围">
                <a-range-picker v-model:value="formState.timerange" placeholder="" />
              </a-form-item>
              <a-form-item label="">
                <a-button size="small" style="margin-right: 1vh; font-size: 1.2vh" @click="exportImage"
                  type="primary">导出图片</a-button>
                <a-button size="small" style="font-size: 1.2vh" @click="exportPDF" type="primary">导出PDF</a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>

      <!-- <div class="LabelContent" style="margin-top: 2vh">
        <span class="title-ellipsis">{{ formState.type }}-参数设置</span>
      </div> -->
      <!-- <div class="l2">
        <a-form :model="formState">
          <a-form-item label="参数设置">
          </a-form-item>
          <a-form-item label="时间范围">
          </a-form-item>
        </a-form>
      </div> -->
    </div>
    <div :class="['AreaSelect', leftCollapse ? 'closeLeftPanel' : 'openLeftPanel']">
      <div class="ButtonContent" @click="toolClick">
        <span class="label ellipsis"> 图层选择 </span>
        <img src="../assets/downArrow.svg" :class="['arrow', activeKey ? 'active' : '']" />
      </div>
      <div class="AreaContainer" v-show="activeKey">
        <div class="title">
          <span>图层列表</span>
          <img src="../assets/close.svg" class="close" @click="close" />
        </div>
        <div class="container">
          <!-- <a-checkbox-group v-model:value="plainOptions" @change="changeLayer" :options="checkedList" /> -->
          <el-checkbox-group v-model="plainOptions" @change="changeLayer">
            <el-checkbox v-for="(item, index) in checkedList" :key="index" :label="item.label" :value="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
:deep(.ant-select .ant-select-selector) {
  height: 3.5vh !important;
  background-color: #ffffff00 !important;
  border: 1px solid #2a579ab0 !important;
  color: aliceblue;
  font-size: 1.2vh !important;
}

:deep(.ant-picker) {
  height: 3.5vh !important;
  padding: 4px 11px 4px;
  color: rgb(251, 247, 247) !important;
  font-size: 13px;
  background: #ffffff00;
  border: 1px solid #2a579ab0;
}

:deep(.ant-picker .ant-picker-input >input::placeholder) {
  color: rgb(239 239 239) !important;
}

:deep(.ant-select .ant-select-selector .ant-select-selection-item) {
  color: #fff !important;
  font-size: 1.5vh !important;
  // line-height: 2.2vh !important;
  display: flex;
  align-items: center;
}

:deep(.ant-picker .ant-picker-clear) {
  background: transparent !important;
}

:deep(.ant-form-horizontal .ant-form-item-label) {
  flex-grow: 0;
  // width: 10vh;
}

:deep(.ant-picker .ant-picker-input >input) {
  color: #fff !important;
}
</style>
<style lang="less">
.el-checkbox__label {
  color: aliceblue;
}

.Mapping {
  .esri-scale-bar {
    bottom: 0;
    right: 0;
    position: absolute;
    height: 30px;
    width: 100px;
    display: flex;
    flex-direction: column;
    color: #fff;
  }

  .esri-compass {
    top: 100px !important;
    right: 25px !important;
    position: absolute !important;
    height: 65px !important;
    display: flex !important;
    flex-direction: column !important;
    color: #fff !important;
  }

  .esri-zoom {
    bottom: 100px;
    right: 25px;
    position: absolute;
    height: 65px;
    display: flex;
    flex-direction: column;
    color: #fff;
  }

  .esri-widget {
    position: absolute;
    color: #fff;
  }

  .esri-widget--button {
    background-color: #266ad165;
    margin-bottom: 1vh;
  }
}

.ant-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  column-gap: 8px;
  flex-direction: column;
  width: 24vh;

  .ant-checkbox-wrapper {
    height: 3vh;
    margin-bottom: 1vh;
    display: flex;
    align-items: center;
    color: #fff !important;
    font-size: 1.3vh;
  }

  .ant-checkbox {
    color: #fff;
    font-size: 1.3vh;

    span {
      color: #fff !important;
    }
  }

  .ant-checkbox-inner {
    width: 1.5vh;
    height: 1.5vh;
    background-color: #3e7dcf;
    border-color: #3e7dcf;
  }
}

.ant-form label {
  font-size: 1.4vh !important;
  color: #fff !important;
}

.ant-input {
  color: #fff;
  font-size: 1.2vh !important;
  background: transparent !important;
  border-color: #2a579ab0 !important;
  padding: 2px 4px;
  text-align: center;
}

.ant-form-item {
  margin-bottom: 1.2vh;
}

.ant-form-horizontal .ant-form-item-label {
  flex-grow: 0;
  width: 8vh;
}

.ant-input::placeholder {
  color: #fff;
}

.ant-radio-inner {
  width: 1.2vh !important;
  height: 1.2vh !important;
}
</style>
<style lang="less" scoped>
#mappingview {
  // width: 4992px !important;
  // height: 2600px !important;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background: #1a4061;
  position: absolute;
}

.Mapping {
  .FlyPanel {
    position: absolute;
    width: 36vh;
    top: 9vh;
    left: 1vh;

    .title {
      position: relative;
      width: 100%;
      height: 3.4vh;
      line-height: 3.4vh;
      // background: #2280cc;
      background: url("/img/modal/header-big.svg#svgView(preserveAspectRatio(none))") no-repeat;
      text-align: left;
      padding-left: 2vh;

      span {
        font-size: 1.6vh;
        font-family: puhui_SemiBold_75;
        color: #ffffffcc;
      }

      .close {
        width: 1.6vh;
        height: 1.6vh;
        position: absolute;
        right: 1vh;
        top: 1vh;
        cursor: pointer;
      }
    }

    .container {
      // background: #07152fcc;
      background: url("/img/modal/body-big.svg#svgView(preserveAspectRatio(none))") no-repeat;
      margin-top: -0.2vh;
    }

    .content {
      width: 32vh;
      height: auto;
      margin: 0 auto;
      padding-top: 1vh;
      padding-bottom: 1vh;

      .LabelContent {
        position: relative;
        width: 29vh;
        height: 3.24vh;
        background: url("../assets/labelBg.png");
        background-size: 100% 100%;
        font-size: 1.5vh;
        font-family: puhui_Heavy_105;
        font-style: italic;
        padding-left: 1.7vh;
        color: #fff;
        line-height: 3.24vh;
        letter-spacing: 0.1vh;
        display: flex;
        margin-left: 0;
        margin-bottom: 1.5vh;

        .collapeIcon {
          position: absolute;
          right: -4vh;
          top: 1vh;
          width: 1.2vh;
          cursor: pointer;
          transform: rotateZ(180deg);

          &.active {
            transform: rotateZ(0deg);
          }
        }
      }
    }
  }

  .l1 {
    height: 28vh;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    color: #fff;
    font-size: 1.2vh;
    align-items: center;
    // padding: 1.5vh;
  }

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
    padding: 1.5vh;
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
<style lang="less" scoped>
.AreaSelect {
  z-index: 99;
  position: absolute;
  left: 4vh;
  top: 8.8vh;

  .ButtonContent {
    position: relative;
    left: 0;
    top: 0;
    width: 11.2vh;
    height: 3.2vh;
    background: #07152fcc;
    border-radius: 4px;
    line-height: 3.2vh;

    .label {
      font-size: 1.6vh;
      font-family: puhui_Regular_55;
      color: #ffffffcc;
      width: 10vh;
      height: 3.2vh;
      line-height: 3.2vh;
      display: inline-block;
      margin-left: 1.3vh;
    }

    .arrow {
      position: absolute;
      width: 1vh;
      right: 1vh;
      top: 1.2vh;
      // cursor: pointer;
      transform: rotateZ(180deg);

      &.active {
        transform: rotateZ(0deg);
      }
    }
  }

  .AreaContainer {
    position: relative;
    width: 30vh;
    left: 0;
    top: 0.8vh;

    .title {
      position: relative;
      width: 100%;
      height: 3.4vh;
      line-height: 3.4vh;
      // background: #2280cc;
      background: url("/img/modal/header-middle.svg#svgView(preserveAspectRatio(none))") no-repeat;
      text-align: left;
      padding-left: 1.4vh;

      // text-align: center;
      span {
        font-size: 1.6vh;
        font-family: puhui_SemiBold_75;
        color: #fff;
      }

      .close {
        width: 1.6vh;
        height: 1.6vh;
        position: absolute;
        right: 0.8vh;
        top: 0.9vh;
        cursor: pointer;
      }
    }

    .container {
      // background: #07152fcc;
      background: url("/img/modal/body-big.svg#svgView(preserveAspectRatio(none))") no-repeat;
      margin-top: -0.2vh;
      height: 40vh;
      padding: 3vh;
    }
  }
}
</style>