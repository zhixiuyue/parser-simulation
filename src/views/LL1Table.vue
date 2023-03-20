<template>
    <div class="table-container">
        <div class="table" @click="showData">
            <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
                <template #content>
                    <span class="title">LL(1)分析表构造</span>
                </template>
            </el-page-header>
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
                <el-table-column prop="nonTerminal" label="" align="center" />
                <el-table-column prop="FIRST" label="FIRST" align="center" />
                <el-table-column prop="FOLLOW" label="FOLLOW" align="center" />
            </el-table>
        </div>
        <RightTips type="grammar" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import { computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const goBack = () => {
    router.push('/');
}

const store = useStore();

const ll1Parser = computed(() => {
    return store.getters["grammarStore/getParser"];
})

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})

const firstSet = computed(() => {
    return ll1Parser.value.getFirstSet();
})

const followSet = computed(() => {
    return ll1Parser.value.getFollowSet(firstSet.value);
})

const tableData = computed(() => {
    const predictTable = ll1Parser.value.getPredictTable(firstSet.value, followSet.value);
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

// TODO
const showData = () => {
    console.log(ll1Parser.value.getPredictTable(firstSet.value, followSet.value))
}
</script>

<style scoped lang="less">
.table-container {
    // height: 91%;
    // justify-content: space-between;
    // flex-direction: column;

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
        // height: 0;
        // overflow: auto;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .table-data {
            background: none;
            width: 100%;

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