<template>
    <div class="dfa-container">
        <RightTips type="grammar" :showArgument="true" />
        <div class="analysis">
            <CustomHeader :step=1 type="LR0" />
            <div class="argument">
                <span>增广语法产生式：{{ argument }}</span>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ selectItems[selectedItem] }}
                        <el-icon class="el-icon--right">
                            <arrow-down />
                        </el-icon>
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, index) in selectItems" :key="item" :command="index"
                                :disabled="selectedItem === index">{{
                                    item
                                }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div id="graph"></div>
            <div class="control-btn" v-show="selectedItem === 1"><el-button text :icon="ArrowLeft" @click="goBack"
                    :disabled="dotIndex <= 1">上一步</el-button>
                <el-button text @click="goForward" :disabled="dotIndex >= graph.length">
                    下一步<el-icon class="el-icon--right">
                        <ArrowRight />
                    </el-icon>
                </el-button>
                {{ dotIndex }} / {{ graph.length }}
            </div>
        </div>
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            :notShowInput="true" @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import CustomHeader from '@/components/Header.vue';
import InputString from '@/components/InputString.vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { LRRoute } from '@/dataList.js';
import * as d3 from "d3"
import "@hpcc-js/wasm"
import "d3-graphviz";

const store = useStore();
const router = useRouter();

const passData = reactive({});
const showDialog = ref(false);

const saveInput = (string, value) => {
    store.commit("grammarStore/updateLRStartNonTerminal", value);
    showDialog.value = false;
}

const startNonTerminal = computed(() => {
    return store.getters["grammarStore/getLRStartNonTerminal"];
})

const onClose = () => {
    if (!startNonTerminal.value) {
        router.push(LRRoute[0].route);
    } else {
        showDialog.value = false;
    }
}

const graphviz = ref();

const graphArr = ref([]);

// const dfs = (edges, fromNodeId) => {
//     if (!edges.length) {
//         return;
//     }
//     edges.forEach((edgeItem) => {
//         if (edgeItem?.next?.id == undefined) {
//             return;
//         }

//         let str = edgeItem?.next?.id === -1 ? `id${edgeItem?.next?.id} [label="Accept" shape="none" style="none" ] ` : `id${edgeItem?.next?.id} [label="S${edgeItem?.next?.id}\n${edgeItem?.next?.items.join('\n')}"] `;
//         if (fromNodeId != undefined) {
//             str += `id${fromNodeId} -> id${edgeItem?.next?.id} [ xlabel="${edgeItem?.tocken}"] `;
//         }
//         graphArr.value = [...graphArr.value, str];
//         setTimeout(() => {
//             dfs(edgeItem?.next?.edges, edgeItem?.next?.id);
//         }, 0);
//     })
// }

const stateValue = ref([]);

const generateDots = (stateNodeValue) => {
    let newArr = [];
    if (!stateNodeValue?.length) {
        return;
    }
    stateNodeValue.forEach((item) => {
        if (!item?.edges?.length) {
            return;
        }
        item.edges.forEach((edgeItem) => {
            graphArr.value = [...graphArr.value,
            edgeItem?.next?.id === -1 ?
                `id [label="Accept" shape="none" style="none" ] id${item.id} -> id [ xlabel="${edgeItem?.tocken}"]` :
                `id${edgeItem?.next?.id} [label="S${edgeItem?.next?.id}\n${edgeItem?.next?.items.join('\n')}"] id${item.id} -> id${edgeItem?.next?.id} [ xlabel="${edgeItem?.tocken}"]`];
            if (edgeItem?.next) {
                newArr = [...newArr, edgeItem?.next];
            }
        })
    })
    stateValue.value = newArr;
}

// onUnmounted(() => {
//     graphviz.value = '';
// })

const nonTerminals = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
});


const generateData = () => {
    const lRParser = store.getters["grammarStore/getLRParser"];
    const grammar = store.getters["grammarStore/getGrammar"];
    const terminal = store.getters["grammarStore/getTerminal"];
    lRParser.generateState(grammar, startNonTerminal.value, nonTerminals.value, terminal);
    const stateNodeValue = lRParser.stateGraph;
    store.commit("grammarStore/updateArgument", stateNodeValue?.items[0]);
    // const disgraph = `digraph  { graph [rankdir = LR splines = ortho bgcolor = "#E9EEF3"] node [ shape="box" style="rounded,filled" 
    // fontname = "Microsoft Yahei", fontsize = 14 margin=0.2 ]
    //  ${generateDots(stateNodeValue).join('')} }`;
    console.log(stateNodeValue);
    // const graph = generateDots(stateNodeValue);
    // generateDots(stateNodeValue);
    graphArr.value = [`id${stateNodeValue?.id} [label="S${stateNodeValue?.id}\n${stateNodeValue?.items.join('\n')}"] `];
    stateValue.value = [stateNodeValue];
    let number = 0;
    while (stateValue.value.length) {
        if (number >= 5) {
            break;
        }
        generateDots(stateValue.value);
        number += 1;
    }
    store.commit("grammarStore/updateGraph", graphArr.value);
}

const graph = computed(() => {
    return store.getters["grammarStore/getGraph"];
})

const argument = computed(() => {
    return store.getters["grammarStore/getArgument"];
})

const dotIndex = ref(1);

const render = () => {
    if (graph.value?.length) {
        function renderData(type) {
            const arr = type === 2 ? graph.value : graph.value.slice(0, dotIndex.value);
            const disGraph = `digraph  { graph [rankdir = LR splines = ortho bgcolor = "#E9EEF3"] node [ shape="box" style="rounded,filled" 
                 fontsize = 14 margin=0.2 ]
                ${arr.join('')} }`;
            graphviz.value?.renderDot(disGraph)
                .on("end", function () {
                    if (type !== 0) {
                        return;
                    }
                    dotIndex.value = dotIndex.value + 1;
                    if (dotIndex.value <= graph.value.length) {
                        render();
                    }
                });
        }
        graphviz.value = d3.select("#graph")?.graphviz().width("100%").height("100%").transition(function () {
            return d3.transition("main")
                .ease(d3.easeLinear)
                // .delay(500)
                .duration(1500);
        }).on("initEnd", renderData(selectedItem.value));
    }
}

const goBack = () => {
    if (dotIndex.value <= 0) return;
    dotIndex.value = dotIndex.value - 1;
    render();
}

const goForward = () => {
    if (dotIndex.value >= graph.value.length) {
        return;
    }
    dotIndex.value = dotIndex.value + 1;
    render();
}

onMounted(() => {
    render();
})

const handleCommand = (command) => {
    selectedItem.value = command;
}

const selectItems = ["自动播放", "手动播放", "不播放"];
const selectedItem = ref(2);

watch(() => startNonTerminal, (newValue, preValue) => {
    if (!newValue.value) {
        if (nonTerminals.value.length === 1) {
            store.commit("grammarStore/updateLRStartNonTerminal", nonTerminals.value[0]);
        }
        else {
            showDialog.value = true;
        }
    } else {
        if (preValue != undefined) {
            generateData();
        } else {
            setTimeout(() => {
                render();
            }, 1000);
        }
    }
}, {
    immediate: true,
    deep: true
})

watch([() => graph.value, selectedItem], ([graph, item], [preGraph, preItem]) => {
    if (graph && (item != undefined)) {
        dotIndex.value = 1;
        render();
    }
},
    {
        // immediate: true,
        deep: true
    }
);
</script>

<style scoped lang="less">
.dfa-container {
    display: flex;
    gap: 10px;
    height: 100%;


    .analysis {
        flex: 1;
        padding: 20px 8%;
        width: 0;
        overflow: auto;
        position: relative;

        .argument {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .el-dropdown-link {
                cursor: pointer;
                color: var(--el-color-primary);
                display: flex;
                align-items: center;
            }
        }

        #graph {
            width: 100%;
            height: 89%;
            margin-top: 10px;
        }

        .control-btn {
            position: absolute;
            bottom: 40px;
            left: 50%;
            transform: translate(-50%);
        }
    }
}
</style>