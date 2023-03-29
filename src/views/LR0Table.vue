<template>
    <div class="table-container">
        <RightTips type="grammar" />
        <div class="table" @click="test">
            <CustomHeader :step=2 type="LR0" />
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
        </div>
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            :notShowInput="true" @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import CustomHeader from '@/components/Header.vue';
import InputString from '../components/InputString.vue';
import { computed, watch, ref, reactive } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LRRoute } from '@/dataList.js';

const router = useRouter();
const type = computed(() => {
    return router.currentRoute.value.query.type;
})

const store = useStore();

const showDialog = ref(false);

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})

const saveInput = (string, value) => {
    store.commit("grammarStore/updateLRStartNonTerminal", value);
    showDialog.value = false;
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
    return store.getters["grammarStore/getLRStartNonTerminal"];
})

const onClose = () => {
    if (!startNonTerminal.value) {
        router.push(LRRoute[1].route);
    } else {
        showDialog.value = false;
    }
}

watch(() => startNonTerminal, (newValue) => {
    if (!newValue.value) {
        showDialog.value = true;
    }
}, {
    immediate: true,
    deep: true
})


const passData = reactive({});
</script>

<style scoped lang="less">
.table-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .table {
        flex: 1;
        padding: 20px 8%;
        width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;
        overflow: auto;

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
    }

}
</style>