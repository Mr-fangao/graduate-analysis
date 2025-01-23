<!--
 * @Author: liqifeng
 * @Date: 2024-08-26 09:37:14
 * @LastEditors: liqifeng Mr.undefine@protonmail.com
 * @LastEditTime: 2025-01-23 17:21:38
 * @Description:
-->
<script setup>
import Bus from "@/buss/eventBus";
import { ref, onMounted, onUnmounted, onBeforeMount, onBeforeUnmount, onBeforeUpdate, onUpdated, watch, getCurrentInstance } from "vue";
import useLoginStore from "@/store/login.js";
import { storeToRefs } from 'pinia';
const { proxy } = getCurrentInstance();
const loginStore = useLoginStore();
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
onMounted(() => {
    if (MenuIndex.value == "/home/mapping") {
    }

});
</script>
<template>
    <div class="Main">
        <div :class="['LeftPanel', leftCollapse ? 'closed' : 'opened']">
            <div :class="['collapse', leftCollapse ? 'active' : '']" @click="leftPanelClick"></div>
            <div class="LabelContent" style="margin-top: 2vh"> <span class="title-ellipsis">版式布局</span> </div>
            <div class="l1">
                
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
.LeftPanel {
    position: absolute;
    z-index: 2;
    /*top: 10vh;*/
    /*left: 1.1vh;*/
    /*width: 34vh;*/
    /*height: 86vh;*/
    left: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 10vh);
    /*background: url("@/views/assets/leftPanel.png");*/
    /*background-size: 100% 100%;*/
    background: linear-gradient(to right, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    padding-top: 1vh;
    padding-left: 0.5vh;
}

.RightPanel {
    position: absolute;
    padding-top: 1vh;
    z-index: 2;
    /*top: 10vh;*/
    /*right: 1.1vh;*/
    /*width: 34vh;*/
    /*height: 86vh;*/
    right: 0;
    top: 7vh;
    width: 34vh;
    height: calc(100% - 10vh);
    /*background: url("@/views/assets/leftPanel.png");*/
    /*background-size: 100% 100%;*/
    background: linear-gradient(to left, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
}

// .MainLegend {
// 	@keyframes openLeft {
// 		from {
// 			transform: translateX(-35.1vh);
// 		}

// 		to {
// 			transform: translateX(0);
// 		}
// 	}
// 	@keyframes closeLeft {
// 		from {
// 			transform: translateX(0);
// 		}

// 		to {
// 			transform: translateX(-35.1vh);
// 		}
// 	}
// 	&.opened {
// 		animation: openLeft 1s;
// 		animation-fill-mode: forwards;
// 	}
// 	&.closed {
// 		animation: closeLeft 1s;
// 		animation-fill-mode: forwards;
// 	}
// }
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
.Main {
    .r2 {
        height: 25vh;
        width: 100%;
    }

    .r1 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.2vh;

    }

    .r3 {
        height: 26vh;
        overflow: hidden;
        width: 100%;
        padding-top: 1vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;

        .item {
            margin-top: 1vh;
            width: 30vh;
            height: 7vh;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .l3row {
                padding: 0 0 0 2vh;
                width: 100%;
                display: flex;
                align-items: center;
                color: #fff;
                font-family: "puhui_Regular_55";
                font-size: 1.2vh;

                .itemtype {
                    font-family: "puhui_Medium_65";
                    font-size: 1.5vh;
                }

                .itemstatus {
                    width: auto;
                    padding: 0 0.8vh;
                    margin: 0.5vh 0;
                    height: 2vh;
                    border-top: 1px solid;
                    text-align: center;
                    margin-right: 0.6vh;
                    border-color: #0df6a0;
                    background-color: #0df6a04d;
                    // margin-bottom: 1.5vh
                }
            }

            .l3row1 {
                height: 2vh;
                justify-content: space-between;
                margin: 0.5vh 0;
            }

            .l3row2 {
                justify-content: flex-start;
                height: 4vh;
                background: url("./assets/task.png") no-repeat center center;
                background-size: 100%;
                padding-bottom: 2vh;

                span {
                    width: 14vh;
                }

                .fixed-width-span {
                    display: inline-block;
                    /* 或者使用 block，根据需求选择 */
                    width: 16vh;
                    /* 设置你需要的固定宽度 */
                    white-space: nowrap;
                    /* 防止文本换行 */
                    overflow: hidden;
                    /* 隐藏超出部分 */
                    text-overflow: ellipsis;
                    /* 超长部分显示省略号 */
                }

                .fixed-width-span::after {
                    content: attr(data-hover);
                    /* 使用data-hover属性的值作为内容 */
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    /* 水平居中 */
                    bottom: calc(100% + 10px);
                    /* 放置在元素下方 */
                    display: none;
                    /* 默认隐藏 */
                    padding: 5px;
                    border: 1px solid #ccc;
                    background-color: #fff;
                    z-index: 1;
                    /* 确保tooltip在其他元素之上 */
                }
            }
        }
    }

    .l3 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        padding: 1vh 0;

        .chartname {
            height: 3vh;
            width: 100;
            text-align: center;
            display: flex;
            color: #fff;
            font-size: 1.5vh;
            font-family: puhui_Medium_65;
        }

        .chartitem {
            height: 28vh;
            width: 100%;
        }
    }

    .l2 {
        height: 25vh;
        width: 90%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        .l2_right {
            width: 20%;
            height: 25vh;
        }

        .l2_left {
            width: 60%;
            height: 25vh;
        }
    }

    .l1 {
        height: 25vh;
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 1.2vh;

        .item {
            height: 95%;
            width: 8.5vh;
            margin: auto 0.8vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            .i1 {
                width: 7vh;
                height: 7vh;
                background-size: 100%;
                margin: 1.5vh 1.5vh 0.3vh 1.5vh;
                background-repeat: no-repeat;
            }

            .i2 {
                position: relative;
                width: 100%;
                height: 2.5vh;
                -webkit-border-radius: 1.5vh;
                -moz-border-radius: 1.5vh;
                border: 1px solid;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .i3 {
                margin: 1vh;

                span {
                    font-size: 1.2vh;
                    color: #fff;
                }

                .itemvalue {
                    font-family: puhui_ExtraBold_95;
                    font-size: 2vh;
                    margin-right: 3px;
                }
            }
        }

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

    .LeftPanel {
        position: absolute;
        z-index: 2;
        /*top: 10vh;*/
        /*left: 1.1vh;*/
        /*width: 34vh;*/
        /*height: 86vh;*/
        /*background: url("../assets/leftPanel.png");*/
        /*background-size: 100% 100%;*/
        left: 0;
        top: 7vh;
        width: 34vh;
        height: calc(100% - 10vh);
        background: linear-gradient(to right, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    }

    .RightPanel {
        position: absolute;
        z-index: 2;
        /*top: 10vh;*/
        /*right: 1.1vh;*/
        /*width: 34vh;*/
        /*height: 86vh;*/
        /*background: url("../assets/leftPanel.png");*/
        /*background-size: 100% 100%;*/
        right: 0;
        width: 34vh;
        top: 7vh;
        height: calc(100% - 10vh);

        background: linear-gradient(to left, #010a1bcc 0, #01011bb2 33%, #010a1b99 65%, transparent 100%);
    }
}
</style>
