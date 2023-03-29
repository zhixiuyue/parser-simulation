<template>
    <div class="table-container">
        <RightTips type="grammar" />
        <div class="table" @click="showData">
            <CustomHeader :step=2 type="LL1" />
            <el-table :data="tableData" max-height="600" border class="table-data">
                <el-table-column fixed prop="nonTerminal" label="" width="150" align="center">
                </el-table-column>
                <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item" align="center">
                    <template #default="scope">
                        <ul>
                            <li v-for=" item in scope.row[scope.column.rawColumnKey]" :key="item">
                                {{ item }}
                            </li>
                        </ul>
                    </template>
                </el-table-column>
            </el-table>
            <div class="first">FIRST&FOLLOW</div>
            <el-table :data="fistData" stripe style="width: 100%" border>
                <el-table-column prop="nonTerminal" label="" align="center" width="150" />
                <el-table-column prop="FIRST" label="FIRST" align="center" />
                <el-table-column prop="FOLLOW" label="FOLLOW" align="center" />
            </el-table>
        </div>
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import CustomHeader from '@/components/Header.vue';
import { computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useStore } from 'vuex';

const store = useStore();

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})

const firstSet = computed(() => {
    return store.getters["grammarStore/getFirstSet"];
});

const followSet = computed(() => {
    return store.getters["grammarStore/getFollowSet"];
});

const tableData = computed(() => {
    const ll1Parser = store.getters["grammarStore/getLL1Parser"];
    const predictTable = ll1Parser.getPredictTable(firstSet.value, followSet.value);
    if (!predictTable.length) {
        return [];
    }
    const arr = predictTable.map((item) => {
        const { nonTerminal = '', terminal2Derivation = {} } = item;
        terminal2Derivation.forEach((value, key) => {
            const { derivations = [], nonTerminal = '' } = value;
            const newStrArr = derivations.map((val) => {
                if (!val.length) return '';
                return `${nonTerminal} => ${val.join(' ')}`;
            })
            terminal2Derivation.set(key, newStrArr);
        })
        return {
            nonTerminal,
            ...Object.fromEntries(terminal2Derivation.entries()),
        }
    })
    return arr;
})

const fistData = computed(() => {
    const firstSetMap = firstSet.value.reduce((acc, curr) => {
        acc[curr.tocken] = `{ ${[...curr.terminals.values()].join(' , ')} }`;
        return acc;
    }, {});
    const followSetMap = followSet.value.reduce((acc, curr) => {
        acc[curr.tocken] = `{ ${[...curr.terminals.values()].join(' , ')} }`;
        return acc;
    }, {});

    const arr = nonTerminal.value.map((val) => {
        return {
            nonTerminal: val,
            FIRST: firstSetMap[val],
            FOLLOW: followSetMap[val],
        }
    });
    return arr;
})

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
            background: none;
            // width: 100%;

            ul {
                padding: 0;
            }

            li {
                list-style-type: none;
            }
        }

        .first {
            font-weight: 600;
            margin-top: 10px;
        }
    }
}
</style>