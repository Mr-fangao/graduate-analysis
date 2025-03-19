<!--
 * @Author: wyy
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: Mr-fangao Mr.undefine@protonmail.com
 * @LastEditTime: 2025-03-19 21:42:16
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
import GeoJSONLayer from '@arcgis/core/layers/GeoJSONLayer';
import HeatmapRenderer from '@arcgis/core/renderers/HeatmapRenderer';
import Legend from '@arcgis/core/widgets/Legend';
const { proxy } = getCurrentInstance();
const loginStore = useLoginStore();
esriConfig.locale = "zh";
let view = null;
const mapView = ref(null);
const activeKey = ref(false);
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
const taskstatus = [ 
  { status: -1, statusname: "正在执行", function: "详情", color: "#69adfc" },
  { status: 0, statusname: "待执行", function: "立即执行", color: "#69c9fb" },
  { status: 1, statusname: "执行完成", function: "回放", color: "#0df6a0" },
  { status: 2, statusname: "执行失败", function: "详情", color: "#dc2828" },
]
const taskData = ref([
  {
    name: "吕严兵",
    sex: "男",
    phone: "13126738821",
    major: "测绘工程",
    sourcePlace: "安徽省潜山县",
    destinationPlace: "江苏省南京市",
    remarks: "考取研究生(河海大学)"
  },
  {
    name: "杨良柱",
    sex: "男",
    phone: "15156446629",
    major: "地理科学",
    sourcePlace: "安徽省宿松县",
    destinationPlace: "湖北省武穴市",
    remarks: "教学人员"
  },
  {
    name: "周露露",
    sex: "女",
    phone: "13956561465",
    major: "地理信息科学",
    sourcePlace: "安徽省郎溪县",
    destinationPlace: "浙江省平湖市",
    remarks: "公务员"
  },
  {
    name: "周杰",
    sex: "男",
    phone: "14790090524",
    major: "地理科学",
    sourcePlace: "安徽省六安市金安区",
    destinationPlace: "安徽省安庆市",
    remarks: "其他专业技术人员"
  },
  {
    name: "顾承越",
    sex: "男",
    phone: "18019845207",
    major: "地理科学",
    sourcePlace: "安徽省五河县",
    destinationPlace: "江苏省南京市",
    remarks: "考取研究生（南京信息工程大学）"
  },
  {
    name: "黄磊",
    sex: "男",
    phone: "14790090543",
    major: "地理信息科学",
    sourcePlace: "安徽省巢湖市",
    destinationPlace: "浙江省杭州市",
    remarks: "其他专业技术人员"
  },
  {
    name: "陈林英",
    sex: "女",
    phone: "18019845386",
    major: "旅游管理",
    sourcePlace: "广东省罗定市",
    destinationPlace: "安徽省滁州市",
    remarks: "商业和服务业人员"
  },
  {
    name: "高玉凤",
    sex: "女",
    phone: "18255061525",
    major: "酒店管理",
    sourcePlace: "安徽省舒城县",
    destinationPlace: "安徽省合肥市",
    remarks: "教学人员"
  }
]);
const taskData2 = ref(
  [
    {
      name: "王佳伟",
      address: "安徽省合肥市瑶海区",
      age: 28,
      sex: "男",
      homeaddress: "合肥市蜀山区长江西路100号",
      phone: "13800138000",
      major: "计算机科学与技术",
      workunit: "阿里巴巴集团"
    },
    {
      name: "李亦娜",
      address: "安徽省芜湖市镜湖区",
      age: 32,
      sex: "女",
      homeaddress: "芜湖市弋江区中山南路200号",
      phone: "13900139000",
      major: "软件工程",
      workunit: "腾讯科技"
    },
    {
      name: "张强",
      address: "安徽省蚌埠市龙子湖区",
      age: 25,
      sex: "男",
      homeaddress: "蚌埠市蚌山区淮河路300号",
      phone: "13700137000",
      major: "电子信息工程",
      workunit: "华为技术有限公司"
    },
    {
      name: "刘慧敏",
      address: "安徽省淮南市田家庵区",
      age: 30,
      sex: "女",
      homeaddress: "淮南市大通区洞山路500号",
      phone: "13600136000",
      major: "人工智能",
      workunit: "字节跳动"
    },
    {
      name: "陈磊",
      address: "安徽省马鞍山市花山区",
      age: 27,
      sex: "男",
      homeaddress: "马鞍山市雨山区湖东路300号",
      phone: "13500135000",
      major: "数据科学",
      workunit: "网易公司"
    },
    {
      name: "杨丽娟",
      address: "安徽省淮北市相山区",
      age: 29,
      sex: "女",
      homeaddress: "淮北市杜集区人民路100号",
      phone: "13400134000",
      major: "网络安全",
      workunit: "百度在线"
    },
    {
      name: "赵瑞鹏",
      address: "安徽省铜陵市铜官区",
      age: 26,
      sex: "男",
      homeaddress: "铜陵市义安区五松山路200号",
      phone: "13300133000",
      major: "云计算",
      workunit: "京东集团"
    },
    {
      name: "黄丽丽",
      address: "安徽省安庆市迎江区",
      age: 31,
      sex: "女",
      homeaddress: "安庆市大观区德宽路50号",
      phone: "13200132000",
      major: "物联网工程",
      workunit: "小米科技"
    },
    {
      name: "周敏涛",
      address: "安徽省黄山市屯溪区",
      age: 33,
      sex: "男",
      homeaddress: "黄山市徽州区永佳大道100号",
      phone: "13100131000",
      major: "金融学",
      workunit: "平安银行"
    },
    {
      name: "徐静怡",
      address: "安徽省阜阳市颍州区",
      age: 24,
      sex: "女",
      homeaddress: "阜阳市颍泉区颍州北路200号",
      phone: "13000130000",
      major: "市场营销",
      workunit: "美团点评"
    }
  ],
);
const taskData3 = ref(
  [
    {
      name: "曹家月",
      address: "安徽省淮南市",
      year: 2023,
      school: "安徽理工大学"
    },
    {
      name: "夏奇亮",
      address: "安徽省合肥市",
      year: 2023,
      school: "安徽大学"
    },
    {
      name: "李昕悦",
      address: "江苏省南京市",
      year: 2023,
      school: "南京信息工程大学"
    },
    {
      name: "姜雯",
      address: "上海市",
      year: 2023,
      school: "上海电机学院"
    },
    {
      name: "杨再冉",
      address: "湖北省武汉市",
      year: 2023,
      school: "江汉大学"
    },
    {
      name: "廖文慧",
      address: "山西省太原市",
      year: 2023,
      school: "太原师范学院"
    },
    {
      name: "丁飞",
      address: "福建省福州市",
      year: 2023,
      school: "福州大学"
    },
  ],
);
const taskData4 = ref([
  {
    name: "李亦娜",
    sex: "男",
    phone: "13126738821",
    major: "测绘工程",
    sourcePlace: "安徽省潜山县",
    destinationPlace: "江苏省南京市",
    remarks: "考取研究生(河海大学)"
  },
  {
    name: "杨良柱",
    sex: "男",
    phone: "15156446629",
    major: "地理科学",
    sourcePlace: "安徽省宿松县",
    destinationPlace: "湖北省武穴市",
    remarks: "教学人员"
  },
  {
    name: "张强",
    sex: "女",
    phone: "13956561465",
    major: "地理信息科学",
    sourcePlace: "安徽省郎溪县",
    destinationPlace: "浙江省平湖市",
    remarks: "公务员"
  },
  {
    name: "杨丽娟",
    sex: "男",
    phone: "14790090524",
    major: "地理科学",
    sourcePlace: "安徽省六安市金安区",
    destinationPlace: "安徽省安庆市",
    remarks: "其他专业技术人员"
  },
  {
    name: "顾承越",
    sex: "男",
    phone: "18019845207",
    major: "地理科学",
    sourcePlace: "安徽省五河县",
    destinationPlace: "江苏省南京市",
    remarks: "考取研究生（南京信息工程大学）"
  },
  {
    name: "吴磊",
    sex: "男",
    phone: "14790090543",
    major: "地理信息科学",
    sourcePlace: "安徽省巢湖市",
    destinationPlace: "浙江省杭州市",
    remarks: "其他专业技术人员"
  },
  {
    name: "陈林英",
    sex: "女",
    phone: "18019845386",
    major: "旅游管理",
    sourcePlace: "广东省罗定市",
    destinationPlace: "安徽省滁州市",
    remarks: "商业和服务业人员"
  },
  {
    name: "高玉凤",
    sex: "女",
    phone: "18255061525",
    major: "酒店管理",
    sourcePlace: "安徽省舒城县",
    destinationPlace: "安徽省合肥市",
    remarks: "教学人员"
  }
]);
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
  const legend = new Legend({
    view: view,
    container: 'legendDiv',
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
let geojsonLayer = null;
let flylayer = [];
//编写一个加载地图服务的方法
function showHeatMap() {
  clearHeatMap();
  let url = '';
  switch (formState.datamodel) {
    case '0':
      url = '/public/生源地3.json';
      break;
    case '1':
      url = '/public/就业地3.json';
      break;
    case '2':
      url = '/public/考研.json';
      break;
    case '3':
      break;
    default:
      console.log(formState.datamodel);
      url = '/public/生源地3.json';
      break;
  }
  // const url = (!formState.datamodel || formState.datamodel == 0) ? '/public/生源地3.json' : '/public/就业地3.json';
  // console.log(url);
  if (formState.datamodel == 3) {
    const layerUrls = [
      "http://localhost:6080/arcgis/rest/services/2024年毕业生轨迹/MapServer/0",
      "http://localhost:6080/arcgis/rest/services/2024年毕业生轨迹/MapServer/1",
      "http://localhost:6080/arcgis/rest/services/2024年毕业生轨迹/MapServer/2"
    ];
    layerUrls.forEach(url => {
      let layer = new FeatureLayer({
        url: url,
      });
      flylayer.push(layer);
      view.map.add(layer);
    });
  } else {
    let name = '';
    switch (formState.datamodel) {
      case '0':
        name = '生源数';
        break;
      case '1':
        name = '就业数';
        break;
      case '2':
        name = '考研信息';
        break;
      default:
        name = '生源数';
        break;
    }
    geojsonLayer = new GeoJSONLayer({
      url: url,
      title: name + "热力图", // 设置图例名称
      renderer: new HeatmapRenderer({
        // field: name,
        colorStops: [
          { ratio: 0, color: 'rgba(0, 255, 0, 0)' },
          { ratio: 0.5, color: 'rgba(255, 255, 0, 0.5)' },
          { ratio: 0.7, color: 'rgba(255, 255, 0, 0.8)' },
          { ratio: 1, color: 'rgba(255, 0, 0, 1)' },
        ],
        radius: 20,
      }),
    });
    view.map.add(geojsonLayer);
  }
}
function showData() {
  clearHeatMap();
  let url = '';
  // switch (formState.datamodel) {
  //   case '0':
  //     url = '/public/生源地3.json';
  //     break;
  //   case '1':
  //     url = '/public/就业地3.json';
  //     break;
  //   case '2':
  //     url = '/public/考研.json';
  //     break;
  //   case '3':
  //     break;
  //   default:
  //     url = '/public/生源地3.json';
  //     break;
  // }
  switch (formState.datamodel) {
    case '0':
      url = 'http://localhost:6080/arcgis/rest/services/2024年毕业生生源地数据/MapServer';
      break;
    case '1':
      url = 'http://localhost:6080/arcgis/rest/services/2024年就业地数据/MapServer';
      break;
    case '2':
      url = 'http://localhost:6080/arcgis/rest/services/2024年毕业生生源地数据/MapServer';
      break;
    case '3':
      break;
    default:
      url = 'http://localhost:6080/arcgis/rest/services/2024年毕业生生源地数据/MapServer';
      break;
  }
  // const url = (!formState.datamodel || formState.datamodel == 0) ? '/public/生源地3.json' : '/public/就业地3.json';
  // console.log(url);
  if (formState.datamodel == 3) {
    return
  } else {
    geojsonLayer = new FeatureLayer({
      url: url,
    });
    view.map.add(geojsonLayer);
    // geojsonLayer = new GeoJSONLayer({
    //   url: url, // 替换为你的 GeoJSON 文件路径
    //   renderer: {
    //     type: 'simple',
    //     symbol: {
    //       type: 'simple-marker',
    //       color: [226, 119, 40],  // 点的颜色
    //       size: 3,                // 点的大小
    //       outline: {
    //         color: [255, 255, 255],  // 点的边框颜色
    //         width: 1                 // 点的边框宽度
    //       }
    //     }
    //   }
    // });
    view.map.add(geojsonLayer);
  }
}
function clearHeatMap() {
  if (geojsonLayer) {
    view.map.remove(geojsonLayer);
  }
  if (flylayer.length > 0) {
    flylayer.forEach(item => {
      view.map.remove(item);
    });
    // view.map.remove(geojsonLayer)
  }
}
const datamodel = ref(1);
const formState = reactive({
  datamodel: null,
  num1: null,
  num2: null,
  year: null,
  c: null,
});
onMounted(() => {
  if (MenuIndex.value == "/home/query") {
    initmap();
  }
});
</script>
<template>
  <div class="Query">
    <div id="queryview" ref="mapView"></div>
    <div id="legendDiv"></div>
    <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
      <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
      <div class="LabelContent" style="margin-top: 2vh">
        <span class="title-ellipsis">查询对象</span>
      </div>
      <div class="l1">
        <a-form :model="formState">
          <a-form-item label="查询数据：">
            <a-select style="width: 18vh" v-model:value="formState.datamodel" placeholder="选择查询数据">
              <a-select-option value="0">生源地</a-select-option>
              <a-select-option value="1">就业地</a-select-option>
              <a-select-option value="2">考研信息</a-select-option>
              <a-select-option value="3">轨迹信息</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="学生学院：">
            <a-select style="width: 18vh" v-model:value="formState.c" placeholder="选择学院">
              <a-select-option value="2">地理信息与旅游学院</a-select-option>
              <a-select-option value="1">文学院</a-select-option>
              <a-select-option value="0.75">土木学院</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="毕业年份">
            <a-select style="width: 18vh" v-model:value="formState.year" placeholder="选择毕业年份">
              <a-select-option value="2">2024</a-select-option>
              <a-select-option value="1">2023</a-select-option>
              <a-select-option value="0.75">2022</a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item label="是否就业">
            <a-radio-group v-model:value="formState.direction">
              <a-radio value="portrait">是</a-radio>
              <a-radio value="landscape">否</a-radio>
            </a-radio-group>
          </a-form-item> -->
          <a-form-item label="">
            <a-button size="small" style="margin-left: 6vh;margin-right: 3vh;font-size: 1.2vh" @click="showData"
              type="primary">查询</a-button>
            <a-button size="small" style="font-size: 1.2vh;" @click="clearHeatMap" type="primary">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">地图参数设置</span>
      </div>
      <div class="l1">
        <a-form :model="formState">
          <a-form-item label="参数一">
            <a-select style="width: 18vh" v-model:value="formState.num1" placeholder="选择参数">
              <a-select-option value="0">生源地</a-select-option>
              <a-select-option value="1">就业地</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数一权重">
            <a-input placeholder="输入权重(0-1)" style="width: 15vh" v-model:value="formState.top" />
          </a-form-item>
          <a-form-item label="参数二">
            <a-select style="width: 18vh" v-model:value="formState.num2" placeholder="选择参数">
              <a-select-option value="0">生源地</a-select-option>
              <a-select-option value="1">就业地</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="参数二权重">
            <a-input placeholder="输入权重(0-1)" style="width: 15vh" v-model:value="formState.top" />
          </a-form-item>
        </a-form>
      </div>
      <div class="LabelContent">
        <span class="title-ellipsis">查询结果</span>
        <a-button size="small" style="margin-left: 19vh;
    margin-right: 3vh;
    font-size: 1.2vh;
    margin-top: 1px;
    height: 2.5vh" @click="showHeatMap" type="primary">{{ formState.datamodel && formState.datamodel == 3 ? '绘制迁徙图' :
      '绘制热力图'
          }}</a-button>
      </div>
      <div class="l3" ref="l3">
        <el-table v-if="!formState.datamodel || formState.datamodel == 0" :data="taskData" height="100%" width="1000"
          :stripe="true" ref="warningtable">
          <el-table-column label="姓名" align="center" width="40" prop="name" />
          <el-table-column label="性别" align="center" width="30" prop="sex" />
          <el-table-column label="联系方式" width="60" align="center" prop="phone" />
          <el-table-column label="专业名称" width="60" align="center" prop="major" />
          <el-table-column label="生源地" align="center" prop="sourcePlace" />
          <el-table-column label="就业地" align="center" prop="destinationPlace" />
          <el-table-column label="备注" align="center" prop="remarks" />
        </el-table>
        <el-table v-if="formState.datamodel == 1" :data="taskData2" height="100%" width="1000" :stripe="true"
          ref="warningtable">
          <el-table-column label="姓名" align="center" width="40" prop="name" />
          <el-table-column label="专业" align="center" prop="major" />
          <el-table-column label="籍贯" align="center" prop="address" />
          <!-- <el-table-column label="年龄" align="center" prop="age" /> -->
          <el-table-column label="性别" align="center" prop="sex" />

          <!-- <el-table-column label="家庭地址" align="center" prop="homeaddress" /> -->
          <!-- <el-table-column label="联系方式" align="center" prop="phone" /> -->
          <!-- <el-table-column label="专业" align="center" prop="major" /> -->
        </el-table>
        <el-table v-if="formState.datamodel == 2" :data="taskData3" height="100%" width="1000" :stripe="true"
          ref="warningtable">
          <el-table-column label="姓名" align="center" width="40" prop="name" />
          <el-table-column label="毕业年份" width="50" align="center" prop="year" />
          <el-table-column label="录取学校" align="center" prop="school" />
          <!-- <el-table-column label="年龄" align="center" prop="age" /> -->
          <el-table-column label="地址" align="center" prop="address" />
          <!-- <el-table-column label="家庭地址" align="center" prop="homeaddress" /> -->
          <!-- <el-table-column label="联系方式" align="center" prop="phone" /> -->
          <!-- <el-table-column label="专业" align="center" prop="major" /> -->
        </el-table>
        <el-table v-if="formState.datamodel == 3" :data="taskData4" height="100%" width="1000" :stripe="true"
          ref="warningtable">
          <el-table-column label="姓名" align="center" width="40" prop="name" />
          <el-table-column label="生源地" align="center" prop="sourcePlace" />
          <el-table-column label="就业地" align="center" prop="destinationPlace" />
          <el-table-column label="专业名称" width="60" align="center" prop="major" />
          <!-- <el-table-column label="联系方式" width="60" align="center" prop="phone" /> -->
          <!-- <el-table-column label="家庭地址" align="center" prop="homeaddress" /> -->
          <!-- <el-table-column label="联系方式" align="center" prop="phone" /> -->
          <!-- <el-table-column label="专业" align="center" prop="major" /> -->
        </el-table>
      </div>
    </div>
    <div :class="['AreaSelect', leftCollapse ? 'closeLeftPanel' : 'openLeftPanel']">
      <div class="ButtonContent" @click="toolClick">
        <span class="label ellipsis"> 空间查询 </span>
        <!-- <img src="../assets/downArrow.svg" :class="['arrow', activeKey ? 'active' : '']" /> -->
      </div>
      <div class="AreaContainer" v-show="activeKey">
        <div class="title">
          <span>图层列表</span>
          <img src="../assets/close.svg" class="close" @click="close" />
        </div>
        <div class="container">
          <el-checkbox-group v-model="plainOptions" @change="changeLayer">
            <el-checkbox v-for="(item, index) in checkedList" :key="index" :label="item.label" :value="item.value">
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <!-- <div class="UavControl">
      <div class="UavContainer">
        <div class="container">
          <div class="c1" :style="uavControlEnable ? '' : 'pointer-events: none'">
            <div class="LabelContent"><span class="ellipsis">查询结果</span></div>
            <div class="content">
              <div class="l1" style="width:29vh">
                <el-table :data="taskData" height="100%" :stripe="true" ref="warningtable">
                  <el-table-column prop="name" label="名称" />
                  <el-table-column prop="flyLineName" label="航线名称" />
                </el-table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="less">
.Query {
  .LeftPanel {
    width: 42vh;
  }

  .AreaSelect {
    z-index: 99;
    position: absolute;
    left: 43px !important;
    top: 10vh !important;
  }

  #legendDiv {
    position: absolute;
    bottom: 20px;
    right: 20px;
    background: #6aabe74f;
    padding: 10px;
    /* border: 1px solid #ccc; */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  .ant-form-horizontal .ant-form-item-label {
    flex-grow: 0;
    width: 10vh;
  }

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
      width: 42vh;
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

    :deep(.el-table) {
      width: 37vh !important;
      background-color: transparent !important;
      border-bottom: none;
      color: #ffffffb3 !important;

      .cell {
        line-height: normal !important;
      }

      .row-highlight {
        background-color: #009adc80 !important;
        /* 设置高亮背景色 */
      }

      tr {
        background-color: transparent !important;
      }

      td {
        text-align: center;
        border-bottom: none;
        /*padding:6px 0px;*/
        padding: 0;
        height: 3.5vh !important;
        line-height: 3.5vh !important;
        font-size: 1.2vh;
      }

      .el-table__header th {
        // background-color: #011213b3 !important;
        background-color: transparent !important;
        color: #ffffff !important;
        text-align: center;
        border-bottom: none !important;
        font-size: "puhui_Regular_55";
        height: 3.5vh !important;
        line-height: 3.5vh !important;
        padding: 0;
        font-size: 1.3vh;
      }

      .cell {
        padding: 0;
      }

      .el-table__row {
        // background-color: #1c3d5170 !important;

        &:hover td {
          background-color: rgba(50, 177, 192, 0.5);
        }
      }

      .el-table__row--striped td {
        background-color: #1d33479c !important;

        &:hover td {
          background-color: rgba(50, 177, 192, 0.5);
        }
      }

      .el-table__inner-wrapper::before {
        height: 0;
      }

      .el-tag.el-tag--success {
        background: transparent;
        border: none;
        color: #3cc41c;
      }

      .el-tag.el-tag--warning {
        background: transparent;
        border: none;
        color: #ff9940;
      }
    }

    .r3input {
      background: transparent;
      border: 1px solid #4d7bc7;
      color: #fff;
    }

    .r3select {
      background: transparent;
      // border: 1px solid #4d7bc7;
      color: #fff;
      width: 9vh;
      height: 3vh;
      font-size: 1vh;
    }
  }

  .LabelContent {
    width: 42vh;
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
    width: 12.2vh;
    height: 4.2vh;
    background: #07152fcc;
    border-radius: 4px;
    line-height: 3.2vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .label {
      font-size: 1.8vh;
      font-family: puhui_Regular_55;
      color: #ffffffcc;
      width: 10vh;
      height: 3.2vh;
      line-height: 3.2vh;
      display: inline-block;
      /* margin-left: 1.3vh; */
      display: flex;
      align-items: center;
      justify-content: center;
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
    width: 35vh;
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
      height: 55vh;
      padding: 3vh;
    }
  }
}
</style>