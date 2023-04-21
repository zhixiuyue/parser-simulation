<template>
    <div class="analysis">
        <!-- <CustomHeader :step=1 type="LR0" /> -->
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
        <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="dotIndex"></D3Graph>
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
    <!-- <RightTips type="grammar" :showArgument="true" /> -->
    <!-- <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            :notShowInput="true" @onClose="onClose" /> -->
</template>

<script setup>
// import CustomHeader from '@/components/Header.vue';
import InputString from '@/components/InputString.vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import D3Graph from '@/components/D3Graph.vue';
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { LRRoute } from '@/dataList.js';

const store = useStore();
const router = useRouter();

const passData = reactive({});
const showDialog = ref(false);

const D3GrapghRef = ref(null);

// const saveInput = (string, value) => {
//     store.commit("grammarStore/updateLRStartNonTerminal", value);
//     showDialog.value = false;
// }

const startNonTerminal = computed(() => {
    return store.getters["grammarStore/getStartTNonTer"];
})

// const onClose = () => {
//     if (!startNonTerminal.value) {
//         router.push(LRRoute[1].route);
//     } else {
//         showDialog.value = false;
//     }
// }

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
    console.log(stateNodeValue);
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

const goBack = () => {
    if (dotIndex.value <= 0) return;
    dotIndex.value = dotIndex.value - 1;
    D3GrapghRef.value.setDotIndexForGraph(dotIndex.value);
    D3GrapghRef.value?.render(selectedItem.value);
}

const goForward = () => {
    if (dotIndex.value >= graph.value.length) {
        return;
    }
    dotIndex.value = dotIndex.value + 1;
    D3GrapghRef.value.setDotIndexForGraph(dotIndex.value);
    D3GrapghRef.value?.render(selectedItem.value);
}

onMounted(() => {
    if (!graph.value?.length) {
        generateData();
    } else {
        D3GrapghRef.value?.render(selectedItem.value);
    }
})

const handleCommand = (command) => {
    selectedItem.value = command;
}

const selectItems = ["自动播放", "手动播放", "不播放"];
const selectedItem = ref(2);

watch(() => startNonTerminal, (newValue, preValue) => {
    if (!newValue.value) {
        router.push(LRRoute[1].route);
        // if (nonTerminals.value.length === 1) {
        //     store.commit("grammarStore/updateLRStartNonTerminal", nonTerminals.value[0]);
        // }
        // else {
        //     showDialog.value = true;
        // }
    } else {
        if (preValue == undefined) {
            setTimeout(() => {
                D3GrapghRef.value?.render(selectedItem.value);
            }, 1000);
        }
    }
}, {
    immediate: true,
    deep: true
})

watch([() => graph.value, selectedItem], ([graphs, item], [preGraph, preItem]) => {
    if (graphs.length && (item != undefined)) {
        dotIndex.value = 1;
        D3GrapghRef.value?.setDotIndexForGraph(dotIndex.value);
        D3GrapghRef.value?.render(item, graphs);
    }
},
    {
        // immediate: true,
        deep: true
    }
);
</script>

<style scoped lang="less">
.analysis {
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

    .control-btn {
        position: absolute;
        bottom: 40px;
        left: 50%;
        transform: translate(-50%);
    }
}
</style>