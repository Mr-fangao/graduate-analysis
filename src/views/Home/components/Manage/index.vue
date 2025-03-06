<!--
 * @Author: wyy
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-03-06 14:49:55
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
// import useLoginStore from "@/store/login.js";
// import { storeToRefs } from "pinia";
// const { proxy } = getCurrentInstance();
const queryParams = reactive({
  current: 1,
  size: 10,
});

const open = ref(false);
const tableParams = reactive({
  list: [],
  total: 0,
});
const airspaceForm = reactive({
});

const modalTitle = ref("机库编辑");
// 表单校验规则
const orderFormRules = ref({
  name: { required: true, message: '项目名称是必填项', trigger: 'blur' },
});
const deptRef = ref(null);
const ids = ref([]);
const names = ref([]);
const delenabled = ref(false);
const selectnum = ref(0);
const fileName = ref('');
const fileInput = ref(null);
const selectFile = () => {
  fileInput.value.click();
};

function handleSelectionChange(selection) {
  ids.value = selection.map((item) => item.id);
  names.value = selection.map((item) => item.name);
  selectnum.value = selection.length;
  delenabled.value = selectnum.value > 0;
}
// 获取列表
function getList() {
  tableParams.list = [
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
    [
      {
        name: "程鹏",
        sex: "男",
        employmentStatus: "签就业协议形式就业",
        employmentUnit: "宁波市开源房地产咨询测绘有限公司",
        unitAddress: "浙江省宁波市解放南路208号6楼",
        employmentType: "其他企业",
        unitIndustry: "科学研究和技术服务业"
      },
      {
        name: "杜珊珊",
        sex: "女",
        employmentStatus: "升学",
        employmentUnit: "中国矿业大学",
        unitAddress: "江苏省徐州市",
        employmentType: "升学",
        unitIndustry: "无"
      },
      {
        name: "孙炳元",
        sex: "男",
        employmentStatus: "签劳动合同形式就业",
        employmentUnit: "长兴县住房和城乡建设局",
        unitAddress: "浙江省长兴县金陵中路257号",
        employmentType: "其他事业单位",
        unitIndustry: "房地产业"
      },
      {
        name: "陈蕊",
        sex: "女",
        employmentStatus: "其他录用形式就业",
        employmentUnit: "滁州博世中学",
        unitAddress: "安徽省滁州市",
        employmentType: "中初教育单位",
        unitIndustry: "教育"
      },
      {
        name: "刘志远",
        sex: "男",
        employmentStatus: "国家基层项目",
        employmentUnit: "村官",
        unitAddress: "安徽省阜南县",
        employmentType: "农村建制村",
        unitIndustry: "公共管理、社会保障和社会组织"
      },
      {
        name: "朱戈思",
        sex: "男",
        employmentStatus: "签劳动合同形式就业",
        employmentUnit: "潜山县国土资源局",
        unitAddress: "安徽省潜山县国土资源局",
        employmentType: "其他事业单位",
        unitIndustry: "科学研究和技术服务业"
      },
      {
        name: "管辉",
        sex: "男",
        employmentStatus: "国家基层项目",
        employmentUnit: "西部计划",
        unitAddress: "马鞍山市博望区团委",
        employmentType: "机关",
        unitIndustry: "公共管理、社会保障和社会组织"
      },
      {
        name: "陶晶晶",
        sex: "女",
        employmentStatus: "其他录用形式就业",
        employmentUnit: "五河农商银行大新支行",
        unitAddress: "安徽省蚌埠市五河县大新县大新镇五河农商银行",
        employmentType: "国有企业",
        unitIndustry: "金融业"
      }
    ],
    [
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
    ],
    [
      {
        userId: "2010212957",
        name: "唐浩",
        password: "212957",
        phone: "14790091567",
        email: "1486695675@qq.com",
        status: "启用"
      },
      {
        userId: "2019210654",
        name: "米雪",
        password: "210654",
        phone: "14755009493",
        email: "3164771327@qq.com",
        status: "启用"
      },
      {
        userId: "2019210649",
        name: "马婧",
        password: "210649",
        phone: "19856914520",
        email: "646161097@qq.com        ",
        status: "启用"
      },
      {
        userId: "2019210631",
        name: "李齐枫",
        password: "210631",
        phone: "17634488977",
        email: "2722977119@qq.com",
        status: "启用"
      },
      {
        userId: "2016210698",
        name: "仝梦圆",
        password: "210698",
        phone: "17375350665",
        email: "2810475108@qq.com",
        status: "启用"
      },
      {
        userId: "2017215085",
        name: "余海洋",
        password: "722150",
        phone: "17856007331",
        email: "2806753286@qq.com",
        status: "启用"
      },
      {
        userId: "2023210654",
        name: "赵传艳",
        password: "210654",
        phone: "17856006520",
        email: "2654201809@qq.com",
        status: "启用"
      }
    ],
    [
      {
        menuId: "1001",
        menuName: "数据面板",
        routePath: "/home",
        icon: "home-icon",
        permissionLevel: "公开",
        sortOrder: "1",
        menuType: "目录"
      },
      {
        menuId: "1002",
        menuName: "用户管理",
        routePath: "/user",
        icon: "user-icon",
        permissionLevel: "管理员",
        sortOrder: "2",
        menuType: "目录"
      },
      {
        menuId: "1003",
        menuName: "角色管理",
        routePath: "/role",
        icon: "role-icon",
        permissionLevel: "管理员",
        sortOrder: "3",
        menuType: "目录"
      },
      {
        menuId: "1004",
        menuName: "菜单管理",
        routePath: "/menu",
        icon: "menu-icon",
        permissionLevel: "管理员",
        sortOrder: "4",
        menuType: "目录"
      },
      {
        menuId: "1005",
        menuName: "时空分析",
        routePath: "/analysis",
        icon: "analysis-icon",
        permissionLevel: "管理员",
        sortOrder: "5",
        menuType: "目录"
      },
      {
        menuId: "1006",
        menuName: "信息查询",
        routePath: "/query",
        icon: "query-icon",
        permissionLevel: "用户",
        sortOrder: "1",
        menuType: "菜单"
      },
      {
        menuId: "1007",
        menuName: "数据制图",
        routePath: "/mapping",
        icon: "mapping-icon",
        permissionLevel: "用户",
        sortOrder: "2",
        menuType: "菜单"
      }
    ],
  ];
}
// 搜索
function handleQuery() {
  getList();
}
// 重置
function resetQuery() {
  queryParams.current = 1;
  queryParams.size = 10;
  queryParams.name = null;
  handleQuery();
}
// 删除
function handleDelete(row) {
  const sourceIds = row.id ? [row.id] : ids.value;
  const roleNames = row.name || names.value;
}

// 关闭弹框
function cancel() {
  resetUavForm();
  open.value = false;
}
const namekey = ref('生源');
// 新增
function addAirport() {
  resetUavForm();
  modalTitle.value = namekey.value + "新增";
  open.value = true;
}
// 查看详情
function seeDetail(row) {
  modalTitle.value = namekey.value + "详情";
  airspaceForm.id = row.id;
  airspaceForm.name = row.name;
  airspaceForm.address = row.address;
  airspaceForm.age = row.age;
  airspaceForm.sex = row.sex;
  airspaceForm.homeaddress = row.homeaddress;
  airspaceForm.phone = row.phone;
  airspaceForm.major = row.major;
  airspaceForm.workunit = row.workunit;
  open.value = true;
}
function editAirport(row) {
  modalTitle.value = namekey.value + "编辑";
  airspaceForm.id = row.id;
  airspaceForm.name = row.name;
  airspaceForm.address = row.address;
  airspaceForm.age = row.age;
  airspaceForm.sex = row.sex;
  airspaceForm.homeaddress = row.homeaddress;
  airspaceForm.phone = row.phone;
  airspaceForm.major = row.major;
  airspaceForm.workunit = row.workunit;
  open.value = true;
}
function resetUavForm() {
  airspaceForm.id = null;
  airspaceForm.name = null;
  airspaceForm.address = null;
  airspaceForm.age = null;
  airspaceForm.sex = null;
  airspaceForm.homeaddress = null;
  airspaceForm.phone = null;
  airspaceForm.major = null;
  airspaceForm.workunit = null;
  open.value = false;
}
function handleDialogClose() {
  resetUavForm();
}
function submitForm() {
  deptRef.value.validate((valid) => {
    if (valid) {
      // proxy.$post("/buildCompany/addOrEdit", airspaceForm).then((res) => {
      //   proxy.$modal.msgSuccess("保存成功!");
      //   getList();
      //   open.value = false;
      // });
    } else {
      // proxy.$modal.msgError("请输入必填项!");
      return false;
    }
  });
}
const isShowTableIndex = ref(1);
function handleSelect(key, keyPath) {
  switch (key) {
    case "1":
      isShowTableIndex.value = key;
      console.log(isShowTableIndex.value);
      namekey.value = "生源";
      break;
    case "2":
      isShowTableIndex.value = key;
      namekey.value = "就业";
      break;
    case "3":
      isShowTableIndex.value = key;
      namekey.value = "迁徙数据";
      break;
    case "4":
      isShowTableIndex.value = key;
      namekey.value = "用户";
      break;
    case "5":
      isShowTableIndex.value = key;
      namekey.value = "菜单";
      break;
    default:
      break;
  }
}
onBeforeMount(async () => {

});
onMounted(() => {
  getList();
});
</script>
<template>
  <div class="app-container" id="airportmanage">
    <el-row class="maincow" :gutter="24">
      <div class="sidebar">
        <el-menu active-text-color="#1ea2d5" background-color="#596f843d" class="el-menu-vertical-demo"
          default-active="1" text-color="#fff" @open="handleOpen" @close="handleClose" @select="handleSelect">
          <el-menu-item index="1">
            <span>生源地数据管理</span>
          </el-menu-item>
          <el-menu-item index="2">
            <span>就业数据管理</span>
          </el-menu-item>
          <el-menu-item index="3">
            <span>毕业生迁徙数据管理</span>
          </el-menu-item>
          <el-menu-item index="4">
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="5">
            <span>菜单管理</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="content">
        <el-col :span="24" :xs="12">
          <!-- 搜索头 -->
          <el-form :model="queryParams" ref="queryRef" :inline="true">
            <el-form-item prop="name">
              <el-input v-model="queryParams.flyName" placeholder="请输入名称" clearable style="width: 200px"
                @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item class="topTool">
              <el-button type="primary" @click="handleQuery">搜索</el-button>
              <el-button type="primary" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
          <el-row :gutter="15" class="mb8">
            <el-col :span="1.5" class="buttoncol">
              <button class="specialButton add" @click="addAirport" style=" width: 12vh;">
                <!-- <svg-icon iconClass="add"></svg-icon> -->
                <span>新增{{ namekey }}</span>
              </button>
            </el-col>
            <el-col :span="1.5" class="buttoncol">
              <button class="specialButton delete" @click="handleDelete"
                :style="!delenabled ? 'cursor: not-allowed;' : ''" :disabled="!delenabled">
                <!-- <svg-icon iconClass="delete_s"></svg-icon> -->
                <span>删除选中</span>
              </button>
            </el-col>
          </el-row>
          <!-- 表格 -->
          <el-table v-if="isShowTableIndex == 1" border :data="tableParams.list[0]"
            @selection-change="handleSelectionChange" style="height: 500px;overflow-y: auto;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="籍贯" align="center" prop="address" />
            <el-table-column label="年龄" align="center" prop="age" />
            <el-table-column label="性别" align="center" prop="sex" />
            <el-table-column label="家庭地址" align="center" prop="homeaddress" />
            <el-table-column label="联系方式" align="center" prop="phone" />
            <el-table-column label="专业" align="center" prop="major" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <button class="specialButton" @click="seeDetail(scope.row)">
                  <span>详情</span>
                </button>
                <button class="specialButton" @click="editAirport(scope.row)">
                  <span>编辑</span>
                </button>
                <button class="specialButton" @click="handleDelete(scope.row)">
                  <span>删除</span>
                </button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="isShowTableIndex == 2" border :data="tableParams.list[1]"
            @selection-change="handleSelectionChange" style="height: 500px;overflow-y: auto;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="性别" align="center" prop="sex" />
            <el-table-column label="毕业去向" align="center" prop="employmentStatus" />
            <el-table-column label="单位名称" align="center" prop="employmentUnit" />
            <el-table-column label="单位地址" align="center" prop="unitAddress" />
            <el-table-column label="单位类型" align="center" prop="employmentType" />
            <el-table-column label="单位行业" align="center" prop="unitIndustry" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <button class="specialButton" @click="seeDetail(scope.row)">
                  <span>详情</span>
                </button>
                <button class="specialButton" @click="editAirport(scope.row)">
                  <span>编辑</span>
                </button>
                <button class="specialButton" @click="handleDelete(scope.row)">
                  <span>删除</span>
                </button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="isShowTableIndex == 3" border :data="tableParams.list[2]"
            @selection-change="handleSelectionChange" style="height: 500px;overflow-y: auto;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="姓名" align="center" prop="name" />
            <el-table-column label="性别" align="center" prop="sex" />
            <el-table-column label="联系方式" align="center" prop="phone" />
            <el-table-column label="专业名称" align="center" prop="major" />
            <el-table-column label="生源地" align="center" prop="sourcePlace" />
            <el-table-column label="就业地" align="center" prop="destinationPlace" />
            <el-table-column label="备注" align="center" prop="remarks" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <button class="specialButton" @click="seeDetail(scope.row)">
                  <span>详情</span>
                </button>
                <button class="specialButton" @click="editAirport(scope.row)">
                  <span>编辑</span>
                </button>
                <button class="specialButton" @click="handleDelete(scope.row)">
                  <span>删除</span>
                </button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="isShowTableIndex == 4" border :data="tableParams.list[3]"
            @selection-change="handleSelectionChange" style="height: 500px;overflow-y: auto;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="用户ID" align="center" prop="userId" />
            <el-table-column label="用户姓名" align="center" prop="name" />
            <el-table-column label="密码" align="center" prop="password" />
            <el-table-column label="联系方式" align="center" prop="phone" />
            <el-table-column label="电子邮箱" align="center" prop="email" />
            <el-table-column label="用户状态" align="center" prop="status" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <button class="specialButton" @click="seeDetail(scope.row)">
                  <span>详情</span>
                </button>
                <button class="specialButton" @click="editAirport(scope.row)">
                  <span>编辑</span>
                </button>
                <button class="specialButton" @click="handleDelete(scope.row)">
                  <span>删除</span>
                </button>
              </template>
            </el-table-column>
          </el-table>
          <el-table v-if="isShowTableIndex == 5" border :data="tableParams.list[4]"
            @selection-change="handleSelectionChange" style="height: 500px;overflow-y: auto;">
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="菜单ID" align="center" prop="menuId" />
            <el-table-column label="菜单名称" align="center" prop="menuName" />
            <el-table-column label="路由地址" align="center" prop="routePath" />
            <el-table-column label="图标" align="center" prop="icon" />
            <el-table-column label="权限等级" align="center" prop="permissionLevel" />
            <el-table-column label="排序" align="center" prop="sortOrder" />
            <el-table-column label="菜单类型" align="center" prop="menuType" />
            <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
              <template #default="scope">
                <button class="specialButton" @click="seeDetail(scope.row)">
                  <span>详情</span>
                </button>
                <button class="specialButton" @click="editAirport(scope.row)">
                  <span>编辑</span>
                </button>
                <button class="specialButton" @click="handleDelete(scope.row)">
                  <span>删除</span>
                </button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </div>
      <!--用户数据-->

    </el-row>
    <el-dialog :title="modalTitle" @close="handleDialogClose" v-model="open" top="10vh" width="75vh" append-to-body
      :close-on-click-modal="false">
      <el-form ref="deptRef" :model="airspaceForm" :rules="orderFormRules" label-width="12vh">
        <el-row>
          <el-col :span="24">
            <el-form-item label="姓名:" prop="name">
              <el-input placeholder="请输入生源姓名" v-model="airspaceForm.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="地址:" prop="address">
              <el-input placeholder="请输入生源地址" v-model="airspaceForm.address" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="年龄:" prop="age">
              <el-input placeholder="请输入生源年龄" v-model="airspaceForm.age" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="性别:" prop="sex">
              <el-input placeholder="请输入生源性别" v-model="airspaceForm.sex" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="家庭地址:" prop="homeaddress">
              <el-input placeholder="请输入生源家庭地址" v-model="airspaceForm.homeaddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="联系方式:" prop="phone">
              <el-input placeholder="请输入生源联系方式" v-model="airspaceForm.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="专业:" prop="major">
              <el-input placeholder="请输入生源专业" v-model="airspaceForm.major" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="工作单位:" prop="workunit">
              <el-input placeholder="请输入生源工作单位" v-model="airspaceForm.workunit" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer v-if="modalTitle != '项目详情'">
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm" style="margin: 0 1vh;">确 定</el-button>
          <el-button @click="cancel" style="margin: 0 1vh;">取 消</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>
<style lang="less">
.el-dialog__footer {
  display: flex;
  justify-content: center;
}

.el-form-item__label {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.avatar-uploader-icon-my {
  height: 5vh;
  width: 5vh;
  border: 1px #b4a0a08c solid;
}

.avatar-my {
  max-width: 16vh;
  max-height: 9vh;
}

.el-dialog .el-dialog__body {
  padding: 10px !important;
  background: #fff !important;
}

.mapcontainer {
  width: 100%;
  height: 36vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;

  .mapdata {
    width: 13vh;
    height: 36vh;
    font-size: 1.2vh;
    display: flex;
    flex-direction: column;

    .maplocationbuttonlong {
      width: 12vh !important;
      height: 2.5vh !important;
      font-size: 1.2vh;
    }

    .maplocationbutton {
      width: 4vh !important;
      height: 2.5vh !important;
      font-size: 1.2vh;
      margin-left: 1.4vh;

      .el-button {
        height: 2.5vh !important;
      }
    }

    .maplocation {
      height: 2vh;
      margin: 0.5vh 0;
      width: 12vh;

      .el-input__inner {
        height: 2vh;
        font-size: 1.2vh;
      }
    }
  }

  #map {
    width: 54vh;
    height: 36vh;
    position: relative;
    // .location{
    // 	background-color: rgb(255, 255, 255);
    // 	color: #666666;
    // 	// border: 1px #666666 solid;
    // 	height: 1.375em;
    // 	width: 1.375em;
    // 	// background-color: red;
    // 	position: absolute;
    // 	left: .5em;
    // 	top: 4em;
    // 	z-index: 999999;
    // }
  }
}
</style>
<style lang="less" scoped>
.app-container {
  height: 100%;
  overflow: hidden;

  .maincow {
    height: 100%;
    top: 50px;
  }

  .sidebar {
    width: 160px;
    background-color: #333;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 0px;
  }

  .sidebar a {
    color: white;
    text-decoration: none;
    margin: 10px 0;
  }

  .content {
    width: 1112px;
    background-color: #f4f4f4;
    padding: 20px;
  }

  #CesiumMap {
    height: 2vh;
    width: 15vh;
  }

  .buttoncol {
    padding-left: 0 !important;
    padding-right: 3px !important;

    button {
      height: 32px !important;
    }

    .specialButton {
      width: 80px;
      display: flex;
      justify-content: center;

      div {
        display: flex;
        align-items: center;
      }

      &.delete {
        display: flex;
        align-items: center;
        border-color: #e833334d !important;
        background-color: #ffeded;
      }

      &.add {
        display: flex;
        align-items: center;
        border-color: #48a7ff4d !important;
        background-color: #e8f4ff;
      }
    }
  }

  .specialButton {
    cursor: pointer;
    height: 28px;
    width: 30px;
    display: inline-block;
    text-align: center;
    background: transparent;
    border-radius: 5px;
    // border: 1px solid #ffffff00 !important;
    color: #606266;
    margin-right: 10px;
    padding: 0;

    // display: flex;
    // flex-direction: row;
    // align-items: center;
    div {
      display: flex;
      align-items: center;
    }

    &.edit {
      border-color: #dfba4b;

      .svg-icon,
      span {
        color: #dfba4b;
      }

      &:hover {
        background: #dfba4b;
        border: none;

        .svg-icon,
        span {
          color: #fff;
        }
      }
    }

    &.send {
      border-color: #1db96c;

      .svg-icon,
      span {
        color: #1db96c;
      }

      &:hover {
        background: #1db96c;
        border: none;

        .svg-icon,
        span {
          color: #fff;
        }
      }
    }

    &.add {
      border-color: #48a6ff;

      .svg-icon,
      span {
        color: #48a6ff;
      }

      &:hover {
        background: #48a6ff;
        border: none;

        .svg-icon,
        span {
          color: #fff;
        }
      }
    }

    &.detail {
      border-color: #48a6ff;

      .svg-icon,
      span {
        color: #48a6ff;
      }

      &:hover {
        background: #48a6ff;
        border: none;

        .svg-icon,
        span {
          color: #fff;
        }
      }
    }

    &.delete {
      border-color: #e83333;

      .svg-icon,
      span {
        color: #e83333;
      }

      &:hover {
        background: #e83333;
        border: none;

        .svg-icon,
        span {
          color: #fff;
        }
      }
    }

    .svg-icon {
      display: inline-block;
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }

    span {
      display: inline-block;
      font-size: 12px;
    }
  }

  .topTool {
    :deep(.el-form-item__content) {
      position: static;

      .t1 {
        position: absolute;
        right: 115px;
      }

      .t2 {
        position: absolute;
        right: 15px;
      }
    }
  }

  // padding: 30px;
  & .el-form {
    :deep(.el-form-item .el-form-item__label) {
      font-weight: bolder;
      color: #000;
    }
  }

  & .el-row {
    margin: 0px 0 13px 0 !important;

    .top-right-btn {
      position: absolute;
      right: 0;
    }
  }

  & .el-table {
    :deep(.el-dropdown) {
      & .el-button {
        border: none;
        background: none;
      }
    }

    :deep(.cell) {
      display: flex !important;
      flex-direction: row;
      justify-content: center;
    }
  }

  .pagination-container {
    float: right;
  }
}
</style>
