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

const dfs = (edges, fromNodeId) => {
    if (!edges.length) {
        return [];
    }
    let result = [];
    edges.forEach((edgeItem) => {
        const { next = {}, tocken } = edgeItem;
        const { id: preId, items, edges: nextEdges } = next;
        let id = preId;
        if (id == undefined) {
            return;
        }
        let str = '';
        if (id === -1) {
            id = '';
            str = str + `id${id} [label="Accept" shape="none" style="none" ] `;
        } else {
            str = str + `id${id} [label="S${id}\n${items.join('\n')}"] `;
        }
        if (fromNodeId != undefined) {
            str = str + `id${fromNodeId} -> id${id} [ xlabel="${tocken}"] `;
        }
        result = [...result, str, ...dfs(nextEdges, id)];
    })
    return result;
}

const generateDots = (stateNodeValue) => {
    const edges = [
        {
            next: stateNodeValue
        }
    ]
    return dfs(edges);
}

onUnmounted(() => {
    graphviz.value = '';
})

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
    const graph = generateDots(stateNodeValue);
    store.commit("grammarStore/updateGraph", graph);
}

const graph = computed(() => {
    return store.getters["grammarStore/getGraph"];
})

const argument = computed(() => {
    return store.getters["grammarStore/getArgument"];
})

const dotIndex = ref(0);

const render = () => {
    if (graph.value?.length) {
        function render() {
            const arr = graph.value.slice(0, dotIndex.value);
            const disGraph = `digraph  { graph [rankdir = LR splines = ortho bgcolor = "#E9EEF3"] node [ shape="box" style="rounded,filled" 
                fontname = "Microsoft Yahei", fontsize = 14 margin=0.2 ]
                ${arr.join('')} }`;
            graphviz.value.renderDot(disGraph)
                .on("end", function () {
                    dotIndex.value = dotIndex.value + 1;
                    if (dotIndex.value <= graph.value.length) {
                        render();
                    }
                });
        }
        // d3.select("#graph")?.graphviz("#graph").width("100%").height("100%")
        //     .renderDot(graph.value);
        graphviz.value = d3.select("#graph").graphviz().width("100%").height("100%").transition(function () {
            return d3.transition("main")
                .ease(d3.easeLinear)
                // .delay(500)
                .duration(1500);
        }).on("initEnd", render);
    }
}

onMounted(() => {
    render();
})

const handleCommand = (command) => {
    selectedItem.value = command;
}

const selectItems = ["自动播放", "手动播放", "不播放"];
const selectedItem = ref(0);

watch(() => startNonTerminal, (newValue, preValue) => {
    if (!newValue.value) {
        if (nonTerminals.value.length === 1) {
            store.commit("grammarStore/updateLRStartNonTerminal", nonTerminals.value[0]);
        }
        else {
            showDialog.value = true;
        }
    } else {
        if (preValue) {
            generateData();
        }
    }
}, {
    immediate: true,
    deep: true
})

watch(() => graph, (newValue) => {
    if (newValue.value) {
        render();
    }
}, {
    // immediate: true,
    deep: true
})
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
    }
}
</style>