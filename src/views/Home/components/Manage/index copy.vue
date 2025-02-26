<script setup>

const { proxy } = getCurrentInstance();
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
const router = useRouter();
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
    proxy.$get("/buildCompany/queryPage", queryParams).then((res) => {
        tableParams.list = res.data.records;
        tableParams.total = parseInt(res.data.total);
    });
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
    proxy.$modal
        .confirm('是否确认删除名称为"' + roleNames + '"的资源?')
        .then(function () {
            return proxy
                .$get("/buildCompany/batchDel", {
                    ids: sourceIds
                })
                .then(function (res) {
                    proxy.$modal.msgSuccess("删除资源成功!");
                    getList();
                });
        })
        .catch(() => { });
}

// 关闭弹框
function cancel() {
    resetUavForm();
    open.value = false;
}
// 新增
function addAirport() {
    resetUavForm();
    modalTitle.value = "项目新增";
    open.value = true;
}
// 查看详情
function seeDetail(row) {
    modalTitle.value = "项目详情";
    airspaceForm.id = row.id;
    airspaceForm.name = row.name;
    airspaceForm.address = row.address;
    airspaceForm.chargerName = row.chargerName;
    airspaceForm.area = row.area;
    open.value = true;
}
function editAirport(row) {
    modalTitle.value = "项目编辑";
    airspaceForm.id = row.id;
    airspaceForm.name = row.name;
    airspaceForm.address = row.address;
    airspaceForm.chargerName = row.chargerName;
    airspaceForm.area = row.area;
    open.value = true;
}
function resetUavForm() {
    airspaceForm.id = null;
    airspaceForm.name = null;
    airspaceForm.address = null;
    airspaceForm.chargerName = null;
    airspaceForm.area = null;
    open.value = false;
}
function handleDialogClose() {
    resetUavForm();
}
function submitForm() {
    deptRef.value.validate((valid) => {
        if (valid) {
            proxy.$post("/buildCompany/addOrEdit", airspaceForm).then((res) => {
                proxy.$modal.msgSuccess("保存成功!");
                getList();
                open.value = false;
            });
        } else {
            proxy.$modal.msgError("请输入必填项!");
            return false;
        }
    });
}
const projectStatusDict = ref([]);
onBeforeMount(async () => {

});
onMounted(() => {
    getList();
});
</script>
<template>
    <div class="app-container" id="airportmanage">
        <el-row :gutter="24">
            <!--用户数据-->
            <el-col :span="24" :xs="24">
                <!-- 搜索头 -->
                <el-form :model="queryParams" ref="queryRef" :inline="true">
                    <el-form-item prop="name">
                        <el-input v-model="queryParams.flyName" placeholder="请输入名称" clearable style="width: 200px"
                            @keyup.enter="handleQuery" @clear="handleQuery" />
                    </el-form-item>
                    <el-form-item class="topTool">
                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                        <el-button type="primary" icon="Refresh" @click="resetQuery">重置</el-button>
                    </el-form-item>
                </el-form>
                <el-row :gutter="15" class="mb8">
                    <el-col :span="1.5" class="buttoncol">
                        <button class="specialButton add" @click="addAirport" style="width: 10vh;">
                            <!-- <svg-icon iconClass="add"></svg-icon> -->
                            <span>新增项目</span>
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
                <el-table border :data="tableParams.list" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="50" align="center" />
                    <el-table-column label="建设单位名称" align="center" prop="name" />
                    <el-table-column label="单位地址" align="center" prop="address" />
                    <el-table-column label="负责人姓名" align="center" prop="chargerName" />
                    <el-table-column label="地址" align="center" prop="area" />
                    <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
                        <template #default="scope">
                            <button class="specialButton" @click="seeDetail(scope.row)">
                                <el-icon :size="15">
                                    <Notification />
                                </el-icon>
                                <span>详情</span>
                            </button>
                            <button class="specialButton" @click="editAirport(scope.row)">
                                <el-icon :size="15">
                                    <Edit />
                                </el-icon>
                                <span>编辑</span>
                            </button>
                            <button class="specialButton" @click="handleDelete(scope.row)">
                                <el-icon :size="15">
                                    <Delete />
                                </el-icon>
                                <span>删除</span>
                            </button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- 分页 -->
                <pagination v-show="tableParams.total > 0" :total="tableParams.total" v-model:page="queryParams.current"
                    v-model:limit="queryParams.size" @pagination="getList" />
            </el-col>
        </el-row>
        <el-dialog :title="modalTitle" @close="handleDialogClose" v-model="open" top="10vh" width="75vh" append-to-body
            :close-on-click-modal="false">
            <el-form ref="deptRef" :model="airspaceForm" :rules="orderFormRules" label-width="12vh">
                <el-row>
                    <el-col :span="20">
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="建设单位名称:" prop="name">
                            <el-input v-model="airspaceForm.name" placeholder="请输入建设单位名称" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="建设单位地址:" prop="address">
                            <el-input v-model="airspaceForm.address" placeholder="请输入建设单位地址" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="负责人姓名:" prop="chargerName">
                            <el-input v-model="airspaceForm.chargerName" placeholder="请输入负责人姓名" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="20">
                        <el-form-item label="建设单位地址:" prop="area">
                            <el-input v-model="airspaceForm.area" placeholder="请输入建设单位地址" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <template #footer v-if="modalTitle != '项目详情'">
                <div class="dialog-footer">
                    <el-button type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>

    </div>
</template>
<style lang="less">
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
<style lang="scss" scoped>
.app-container {
    height: 100%;
    overflow: hidden;

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
            &.delete {
                border-color: #e833334d !important;
                background-color: #ffeded;
            }

            &.add {
                border-color: #48a7ff4d !important;
                background-color: #e8f4ff;
            }
        }
    }

    .specialButton {
        cursor: pointer;
        height: 28px;
        width: 30px;
        text-align: center;
        background: transparent;
        border-radius: 5px;
        border: 1px solid #ffffff00 !important;
        color: #606266;
        margin-right: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 0;
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
        margin: 10px 0 20px 0 !important;

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
            button{
                padding: 0 !important;
            }
        }
    }

    .pagination-container {
        float: right;
    }
}
</style>
