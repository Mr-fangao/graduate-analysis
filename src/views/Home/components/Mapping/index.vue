<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-02-18 17:36:39
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
  rate: "1",
  direction: "landscape",
  top: "",
  left: "",
  bottom: "",
  right: "",
  size: "A4",
  dpi: 100,
  northsize: null,
  north: null,
  name: "",
  subname: "",
  scalebarsize: "",
  scalebar: "",
  fillcolor: "",
  filename: "",
});
const checkedList = ref([]);
const plainOptions = [
  {
    label: "2024毕业生生源地分析图",
    value: 'http://localhost:6080/arcgis/rest/services/2020生源地/MapServer/0'
  },
  {
    label: "2023毕业生生源地分析图",

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

const paperDimensions = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  B3: { width: 353, height: 500 },
  B4: { width: 250, height: 353 },
  Letter: { width: 216, height: 279 },
  Legal: { width: 216, height: 356 },
};
const paperSizes = Object.keys(paperDimensions);
const onSubmit = () => {
  console.log("submit!", toRaw(formState));
};
function initmap() {
  // const map = new Map({
  //     basemap: 'streets-night-vector',
  // });
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
const mmToPixels = (mm) => Math.round((mm * formState.dpi) / 25.4);
const getPrintSize = () => {
  const dimensions = paperDimensions[formState.size];
  const isLandscape = formState.direction === "landscape";
  return {
    width: mmToPixels(isLandscape ? dimensions.height : dimensions.width),
    height: mmToPixels(isLandscape ? dimensions.width : dimensions.height),
  };
};

const processExport = async (callback) => {
  const { width, height } = getPrintSize();
  const contentWidth = width - formState.left - formState.right;
  const contentHeight = height - formState.top - formState.bottom;
  // 第一步：获取地图截图
  const screenshot = await view.takeScreenshot({
    width: contentWidth,
    height: contentHeight,
    format: "png",
    quality: 100,
  });
  // 第二步：使用html2canvas合成其他元素
  const printArea = document.getElementById("printArea");
  const printMap = printArea.querySelector("#printMap");
  // 更新打印预览地图尺寸
  printMap.style.width = `${contentWidth}px`;
  printMap.style.height = `${contentHeight}px`;
  // 将截图插入打印区域
  const img = new Image();
  img.src = screenshot.dataUrl;
  printMap.innerHTML = "";
  printMap.appendChild(img);
  // 合成整个打印区域
  const canvas = await html2canvas(printArea, {
    useCORS: true,
    scale: formState.rate,
    logging: false,
    width: contentWidth,
    height: contentHeight,
  });
  const finalCanvas = document.createElement("canvas");
  finalCanvas.width = width;
  finalCanvas.height = height;
  const context = finalCanvas.getContext("2d");
  context.fillStyle = "#FFFFFF";
  context.fillRect(0, 0, width, height);
  context.drawImage(canvas, formState.left, formState.top);
  if (formState.name) {
    // 添加图名文本
    const title = formState.name; // 替换为实际的图名
    const titleFontSize = 24; // 字体大小
    const titleColor = "#FFFFFF"; // 字体颜色
    const titleX = width / 2; // 水平居中
    const titleY = 50; // 距离顶部50px
    context.font = `${titleFontSize}px Arial`; // 设置字体
    context.fillStyle = titleColor; // 设置颜色
    context.textAlign = "center"; // 水平居中
    context.textBaseline = "top"; // 垂直对齐方式
    context.fillText(title, titleX, titleY); // 绘制文本
  }
  console.log("Canvas Size:", {
    width: finalCanvas.width,
    height: finalCanvas.height,
  });
  callback(finalCanvas);
};

// 导出为图片
const exportImage = () => {
  processExport((canvas) => {
    const link = document.createElement("a");
    let name = `map_${formState.size}_${formState.direction}.png`;
    if (formState.filename) {
      name = formState.filename + ".png";
    }
    link.download = name;
    link.href = canvas.toDataURL("image/png");
    link.click();
  });
};

// 导出为PDF
const exportPDF = () => {
  processExport((canvas) => {
    const pdf = new jsPDF({
      orientation: formState.direction,
      unit: "mm",
      format: formState.size.toLowerCase(),
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    let name = `map_${formState.size}_${formState.direction}.pdf`;
    if (formState.filename) {
      name = formState.filename + ".pdf";
    }
    pdf.save(name);
  });
};
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
  if (MenuIndex.value == "/home/mapping") {
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
    <div id="printArea" class="print-area">
      <div class="map-wrapper">
        <div id="printMap"></div>
      </div>
      <!-- <div class="map-overlay">
                <div class="map-title">我的地图</div>
            </div> -->
    </div>
    <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
      <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
      <div class="LabelContent" style="margin-top: 2vh">
        <span class="title-ellipsis">版式布局</span>
      </div>
      <div class="l1">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-form-item label="Activity name">
                        <a-input v-model:value="formState.name" />
                    </a-form-item> -->
          <a-form-item label="页面尺寸">
            <a-select v-model:value="formState.size" style="width: 16vh" placeholder="">
              <a-select-option v-for="(item, index) in paperSizes" :value="item" :key="index">{{ item
                }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="缩放比例">
            <a-select v-model:value="formState.rate" placeholder="" style="width: 16vh">
              <a-select-option value="2">200%</a-select-option>
              <a-select-option value="1">100%</a-select-option>
              <a-select-option value="0.75">75%</a-select-option>
              <a-select-option value="0.5">50%</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="页面边距">
            <a-input placeholder="上" style="width: 3vh" v-model:value="formState.top" />
            <a-input placeholder="左" style="width: 3vh" v-model:value="formState.left" />
            <a-input placeholder="下" style="width: 3vh" v-model:value="formState.bottom" />
            <a-input placeholder="右" style="width: 3vh" v-model:value="formState.right" />
            <span style="font-size: 1vh; color: #ffffff; margin-left: 0.6vh">
              单位:mm</span>
          </a-form-item>
          <a-form-item label="页面方向">
            <a-radio-group v-model:value="formState.direction">
              <a-radio value="portrait">纵向</a-radio>
              <a-radio value="landscape">横向</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">地图要素</span>
      </div>
      <div class="l2">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <!-- <a-form-item label="Activity name">
                        <a-input v-model:value="formState.name" />
                    </a-form-item> -->
          <a-form-item label="添加图名">
            <a-input placeholder="请输入图名" v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="添加副标题">
            <a-input placeholder="请输入副标题" v-model:value="formState.subname" />
          </a-form-item>
          <a-form-item label="添加指北针">
            <a-select style="width: 10vh" v-model:value="formState.north" placeholder="选择指北针">
              <a-select-option value="2">样式一</a-select-option>
              <a-select-option value="1">样式二</a-select-option>
              <a-select-option value="0.75">样式三</a-select-option>
            </a-select>
            <a-select style="width: 10vh" v-model:value="formState.northsize" placeholder="选择尺寸">
              <a-select-option value="2">200px</a-select-option>
              <a-select-option value="1">100px</a-select-option>
              <a-select-option value="0.75">50px</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="添加比例尺">
            <a-select style="width: 10vh" v-model:value="formState.scalebar" placeholder="选择比例尺">
              <a-select-option value="2">样式一</a-select-option>
              <a-select-option value="1">样式二</a-select-option>
              <a-select-option value="0.75">样式三</a-select-option>
            </a-select>
            <a-select style="width: 10vh" v-model:value="formState.scalebarsize" placeholder="选择尺寸">
              <a-select-option value="2">200px</a-select-option>
              <a-select-option value="1">100px</a-select-option>
              <a-select-option value="0.75">50px</a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">出图设置</span>
      </div>
      <div class="l3" ref="l3">
        <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="成像质量">
            <a-select v-model:value="formState.dpi" placeholder="选择成像质量" style="width: 16vh">
              <a-select-option value="300">300</a-select-option>
              <a-select-option value="120">120</a-select-option>
              <a-select-option value="100">100</a-select-option>
              <a-select-option value="72">72</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="地图背景色">
            <a-input placeholder="请输入16进制颜色" v-model:value="formState.fillcolor" />
          </a-form-item>
          <a-form-item label="添加文件名">
            <a-input placeholder="请输入文件名" v-model:value="formState.filename" />
          </a-form-item>
          <a-form-item label="导出设置">
            <a-button size="small" style="margin-right: 1vh; font-size: 1.2vh" @click="exportImage"
              type="primary">导出图片</a-button>
            <a-button size="small" style="font-size: 1.2vh" @click="exportPDF" type="primary">导出PDF</a-button>
          </a-form-item>
        </a-form>
        <!-- <button @click="exportImage">导出图片</button>
                <button @click="exportPDF">导出PDF</button> -->
      </div>
    </div>
    <div :class="['AreaSelect', leftCollapse ? 'closeLeftPanel' : 'openLeftPanel']" v-show="!isFly">
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
          <a-checkbox-group v-model:value="checkedList" @change="changeLayer" :options="plainOptions" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
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
  left: 0;
  top: 9.8vh;

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