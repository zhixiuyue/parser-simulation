<template>
    <div class="table-container">
        <div class="table" @click="test">
            <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
                <template #content>
                    <span class="title">{{ type=== 'LR0' ? 'LR(0)' : 'SLR(1)'}}分析表构造</span>
                </template>
            </el-page-header>
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
        <RightTips type="grammar" />
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            notShowInput="true" @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import InputString from '../components/InputString.vue';
import lucy from "lucy-compiler";
import { computed, watch, ref, reactive } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const goBack = () => {
    router.push('/');
}

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
    store.commit("grammarStore/updateStartNonTerminal", value);
    showDialog.value = false;
}

const tableData = computed(() => {
    const lRParser = new lucy.LRParser();
    const grammar = store.getters["grammarStore/getGrammar"];
    const nonTerminals = store.getters["grammarStore/getNonTerminal"];
    const terminal = store.getters["grammarStore/getTerminal"];;
    lRParser.generateState(grammar, startNonTerminal.value, nonTerminals, terminal);
    const predictTable = lRParser.generateSLR1PredictTable();
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
    return store.getters["grammarStore/getStartNonTerminal"];
})

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
        padding: 20px;
        width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .title {
            font-weight: 600;
            font-size: 14px;
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
    }

}
</style>