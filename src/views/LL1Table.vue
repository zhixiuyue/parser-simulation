<template>
    <div class="table-container">
        <div class="table">
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
            <el-table :data="tableData_1" stripe style="width: 100%">
                <el-table-column prop="nonTerminal" label="" />
                <el-table-column prop="FIRST" label="FIRST" />
                <el-table-column prop="FOLLOW" label="FOLLOW" />
            </el-table>
        </div>
        <RightTips type="grammar" />
    </div>
    <!-- <div class="table-container">
        <div class="table">
        </div>
        <div>
            <span>计算规则</span>
            <ul class="compute-rules">
                <li v-for="item in TABLERULES" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div> -->
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import { reactive, ref, nextTick, computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const unfold = ref(true);
const router = useRouter();
const goBack = () => {
    router.push('/');
}

const store = useStore();

//     created() {
//         this.TABLERULES = [
//             "若X ∈ VT，则FIRST(X) = {X}；【终结符自己就是自己的FIRST集合】",
//             "若X ∈ VN，且有产生式X -> a……， a ∈ VT，则a ∈ FIRST(X)；【非终结符，选第一个终结符加入】",
//             "若X ∈ VN，X -> ε，则 ε ∈ FIRST(X)；【能直接推出ε，ε加入FIRST】",
//             "若X,Y1,Y2,……,Yn ∈ VN，而有产生式X -> Y1,Y2,……,Yn。当Y1,Y2,……,Y(i-1)直接推出ε时，则FIRST(Y1) - ε, FIRST(Y2) - ε, …… , FIRST(Y(i-1) - ε) ,FIRST(Yi) 都包含在FIRST(X)中；【位于中间的ε是不可加入进去】",
//             "当（4）中所有Yi 都推出 ε时，则最后的FIRST(X) = FIRST(Y1) ∪ FIRST(Y2) ∪ …… ∪ FIRST(Yn) ∪ {ε}；"
//         ];
//     }
// }

const ll1Parser = computed(() => {
    return store.getters["grammarStore/getParser"];
})

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.getters["grammarStore/getTerminal"];
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


// const tableData_1 = computed(()=>{
//     const arr = [];

// })
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
        // height: 0;
        // overflow: auto;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .table-data {
            background: none;
            width: 100%;
            margin-top: 10px;

            ul {
                padding: 0;
            }

            li {
                list-style-type: none;
            }
        }

        .first {
            font-weight: 600;
            margin-top: 20px;
        }
    }

    .compute-rules {
        font-size: 14px;
        line-height: 1.5;
    }
}
</style>