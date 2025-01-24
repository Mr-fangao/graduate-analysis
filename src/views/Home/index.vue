<!--
 * @Author: liqifeng
 * @Date: 2025-01-21 14:07:20
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-24 11:08:03
 * @Description: 
-->
<template>
    <div id="threedmap">
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
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';

const loginStore = useLoginStore();
const { leftCollapse, rightCollapse, MenuIndex } = storeToRefs(loginStore);
// 设置语言为中文
const router = useRouter();
const { proxy } = getCurrentInstance();
let tracklineani = -1;
const tracklineleft = ref(0);
const tracklinetotalsec = 6;
const MenuList = [
    {
        title: "数据面板",
        path: "/home/datapanel",
    },
    {
        title: "空间分析",
        path: "/home/analysis",
    },
    {
        title: "数据制图",
        path: "/home/mapping",
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
    // initmap();
    if (MenuList.length > 0) {
        MenuIndex.value = MenuList[0].path;
        router.push(MenuList[0].path);
    }
});
</script>
<style  lang="less">
.LeftPanel {
    position: absolute;
    z-index: 2;
    // top: 10vh;
    // left: 1.1vh;
    // width: 34vh;
    // height: 86vh;
    left: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 8vh);
    // background: url("@/views/assets/leftPanel.png");
    // background-size: 100% 100%;
    background: linear-gradient(to right, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    padding-top: 1vh;
    padding-left: 0.5vh;
}

.RightPanel {
    position: absolute;
    padding-top: 1vh;
    z-index: 2;
    // top: 10vh;
    // right: 1.1vh;
    // width: 34vh;
    // height: 86vh;
    right: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 8vh);
    // background: url("@/views/assets/leftPanel.png");
    background-size: 100% 100%;
    // background: linear-gradient(to left, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
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