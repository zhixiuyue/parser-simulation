<template>
    <div class="table-container">
        <div class="table" @click="test">
            <!-- <CustomHeader :step=2 type="LR0" /> -->
            <div class="first">
                LR(0)分析表
                <el-tooltip class="box-item" effect="dark" :content="play ? '隐藏DFA' : '显示DFA'" placement="top">
                    <el-icon @click="hanlePlay">
                        <View v-if="!play" />
                        <Hide v-else />
                    </el-icon>
                </el-tooltip>
            </div>
            <el-table :data="tableData" class="table-data" stripe>
                <el-table-column prop="State" label="STATE" align="center" />
                <el-table-column label="ACTION" align="center">
                    <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item" align="center">
                        <template #default="scope">
                            <ul>
                                <li v-for=" item in scope.row[scope.column.rawColumnKey]" :key="item">
                                    {{ item }}
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="GOTO" align="center">
                    <el-table-column v-for="item in nonTerminal" :key="item" :prop="item" :label="item" align="center">
                        <template #default="scope">
                            <ul>
                                <li v-for=" item in scope.row[scope.column.rawColumnKey]" :key="item">
                                    {{ item }}
                                </li>
                            </ul>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-drawer v-model="drawer" title="LR(0)DFA" direction="rtl" size="33%">
                <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="1" :defaultDirection="true"></D3Graph>
            </el-drawer>
            <!-- <el-button v-show="!play" class="open-dfa" @click="openDrawer">
                查看DFA
            </el-button> -->
        </div>
        <div class="graph" v-show="play">
            <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="1" :defaultDirection="true">
            </D3Graph>
        </div>
    </div>
    <!-- <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            :notShowInput="true" @onClose="onClose" /> -->
</template>

<script setup>
// import CustomHeader from '@/components/Header.vue';
import InputString from '../components/InputString.vue';
import D3Graph from '@/components/D3Graph.vue';
import { computed, watch, ref, reactive, onMounted } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LRRoute } from '@/dataList.js';

const router = useRouter();
const type = computed(() => {
    return router.currentRoute.value.query.type;
})

const D3GrapghRef = ref(null);

const store = useStore();

const drawer = ref(false)

const showDialog = ref(false);

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})

const graph = computed(() => {
    return store.getters["grammarStore/getGraph"];
})

const openDrawer = () => {
    drawer.value = true;
}

// const saveInput = (string, value) => {
//     store.commit("grammarStore/updateLRStartNonTerminal", value);
//     showDialog.value = false;
// }

const play = ref(false);

const unfold = computed(() => {
    return store.getters["grammarStore/getUnFold"];
})

const hanlePlay = () => {
    play.value = !play.value;
}

const LRPredictTable = computed(() => {
    const lRParser = store.getters["grammarStore/getLRParser"];
    const predictTable = lRParser.generateSLR1PredictTable();
    return predictTable;
})

watch(() => LRPredictTable, (newValue) => {
    store.commit("grammarStore/updateLRPredictTable", newValue.value);
}, {
    immediate: true,
    deep: true
})

const tableData = computed(() => {
    const predictTable = LRPredictTable.value;
    if (!predictTable.length) {
        return;
    }
    const arr = predictTable.map((item, index) => {
        const { action = {}, goto = {} } = item;
        return {
            State: index,
            ...Object.fromEntries(action.entries()),
            ...Object.fromEntries(goto.entries()),
        }
    })
    return arr;
})

const startNonTerminal = computed(() => {
    return store.getters["grammarStore/getStartTNonTer"];
})

const onClose = () => {
    if (!startNonTerminal.value) {
        router.push(LRRoute[1].route);
    } else {
        showDialog.value = false;
    }
}

watch(() => startNonTerminal, (newValue, preValue) => {
    if (!newValue.value) {
        router.push(LRRoute[1].route);
        // showDialog.value = true;
    }
}, {
    immediate: true,
    deep: true
})

watch(() => D3GrapghRef, (newValue, preValue) => {
    if (newValue.value) {
        D3GrapghRef.value?.render(2);
        setTimeout(() => {
            D3GrapghRef.value?.render(2);
        }, 100);
    }
}, {
    // immediate: true,
    deep: true
})

const foldStatus = ref(store.state.grammarStore.unfold);

watch(() => play, (newValue) => {
    if (newValue.value) {
        store.commit("grammarStore/updateUnfold", false);
    } else {
        store.commit("grammarStore/updateUnfold", foldStatus.value);
    };
}, {
    deep: true
})



const passData = reactive({});
</script>

<style scoped lang="less">
.table-container {
    display: flex;
    height: 100%;
    gap: 10px;
}

.graph {
    flex: 1;
    height: 100%;
}

.table {
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex: 1;
    width: 0;

    .first {
        font-weight: 600;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            cursor: pointer;
        }
    }

    .title {
        margin: 10px 0;
    }

    .table-data {

        ul {
            padding: 0;
        }

        li {
            list-style-type: none;
        }

        // :global(.el-table .cell) {
        //     padding: 0;
        // }
    }

    .open-dfa {
        width: fit-content;
    }
}
</style>