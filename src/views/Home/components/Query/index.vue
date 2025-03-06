<!--
 * @Author: wyy
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-03-06 16:31:30
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
onMounted(() => {
  if (MenuIndex.value == "/home/query") {
    initmap();
  }
});
</script>
<template>
  <div class="Query">
    <div id="queryview" ref="mapView"></div>
    <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
      <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
      <div class="LabelContent" style="margin-top: 2vh">
        <span class="title-ellipsis">版式布局</span>
      </div>
      <div class="l1">
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">地图要素</span>
      </div>
      <div class="l2">
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">出图设置</span>
      </div>
      <div class="l3" ref="l3">
      </div>
    </div>
    <div class="UavControl">
      <div class="UavContainer">
        <div class="container">
          <div class="c1" :style="uavControlEnable ? '' : 'pointer-events: none'">
            <div class="LabelContent"><span class="ellipsis">无人机控制</span></div>
            <div class="content">
              <div class="l1">

              </div>
              <div class="l2">

              </div>
              <div class="l3">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less">
.Query {
  .UavControl {
    width: 142vh;
    // height: 27vh;
    height: 32vh;
    position: absolute;
    left: 35vh;
    bottom: 3vh;
    pointer-events: none;

    .UavContainer {
      /*width: 174vh;*/
      /*height: 27vh;*/
      width: 142vh;

      // background: red;
      margin: 0 auto;

      .container {
        /*width: 170vh;*/
        /*height: 27vh;*/
        background: url("./assets/bg.png") no-repeat;
        background-size: 100% 100%;
        padding: 0.5vh;
        // display: flex;
        pointer-events: all;
      }
    }

    .LabelContent {
      // margin-top: 0.5vh;
      width: 32vh;
      height: 3.24vh;
      background: url("./assets/labelBg.png");
      background-size: 100% 100%;
      // margin-left: 1vh;
      font-size: 1.5vh;
      font-family: puhui_Heavy_105;
      font-style: italic;
      padding-left: 1.7vh;
      color: #fff;
      line-height: 3.24vh;
      letter-spacing: 0.1vh;
      display: flex;
    }

    .content {
      /*height: 22vh;*/
      height: 29vh;
      width: 100%;
      // background: red;
      background: #07152f1f;
    }
  }

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
    opacity: 0;
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
#queryview {
  // width: 4992px !important;
  // height: 2600px !important;
  width: 100%;
  height: 100%;
  overflow-y: hidden;
  overflow-x: hidden;
  background: #1a4061;
  position: absolute;
}

.Query {

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