<template>
    <div class="analysis-container">
        <div class="analysis">
            <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
                <template #content>
                    <span class="title">LL(1)分析</span>
                </template>
            </el-page-header>
            <div class="content">
                <div class="input-string">
                    <span>输入串：{{ parserString }}</span>
                    <span>首个非终结符：{{ nonTerminal }}</span>
                    <el-icon class="icon" @click="modifyInput">
                        <Edit />
                    </el-icon>
                </div>
                <el-table :data="parserData" stripe style="width: 100%" border class="table">
                    <el-table-column prop="Step" label="Step" align="center" />
                    <el-table-column prop="Stack" label="Stack" align="center" />
                    <el-table-column prop="Input" label="Input" align="center" />
                    <el-table-column prop="Action" label="Action" align="center" />
                </el-table>
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
            </div>
        </div>
        <RightTips type="grammar" />
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LL1" @saveInput="saveInput" :data="passData"
            @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import InputString from '../components/InputString.vue';
import { ref, computed, watch, reactive } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const goBack = () => {
    router.push('/');
}

const passData = reactive({});

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getStartNonTerminal"];
})

const saveInput = (string, value) => {
    store.commit("grammarStore/updateLL1ParserString", string);
    store.commit("grammarStore/updateStartNonTerminal", value);
    showDialog.value = false;
}

const parserString = computed(() => {
    return store.getters["grammarStore/getLL1ParserString"];
})

const predictTable = computed(() => {
    const ll1Parser = store.getters["grammarStore/getParser"];
    const firstSet = ll1Parser.getFirstSet();
    const followSet = ll1Parser.getFollowSet(firstSet);
    const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
    return predictTable;
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})

const tableData = computed(() => {
    if (!predictTable.value.length) {
        return [];
    }
    const arr = predictTable.value.map((item) => {
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


const parserData = computed(() => {
    if (!parserString.value || !nonTerminal.value) {
        return [];
    }
    const ll1Parser = store.getters["grammarStore/getParser"];
    const predictResult = ll1Parser.getPredictProcess(
        parserString.value,
        nonTerminal.value,
        predictTable.value
    );
    const data = predictResult.map((value, index) => {
        return {
            Step: index + 1,
            Stack: value.parseStack.reverse().join(''),
            Input: value.remainingInput + '$',
            Action: value.parseAction
        }
    })
    return data;
})

const showDialog = ref(false);

const onClose = () => {
    if (!parserString.value || !nonTerminal.value) {
        router.push('/');
    } else {
        showDialog.value = false;
    }
}

const modifyInput = () => {
    showDialog.value = true;
    passData['inputString'] = parserString;
    passData['value'] = nonTerminal;
}

watch(() => parserString, (newValue) => {
    if (!newValue.value) {
        showDialog.value = true;
    }
}, {
    immediate: true,
    deep: true
})

</script>

<style scoped lang="less">
.analysis-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .analysis {
        flex: 1;
        padding: 20px;
        width: 0;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .content {
            padding: 10px 20px;

            .input-string {
                display: flex;
                gap: 20px;
                align-items: center;

                svg {
                    cursor: pointer;

                    &:hover {
                        color: #409eff;
                    }
                }
            }

            div+div {
                margin-top: 10px;
            }

            .table {
                margin-top: 20px;
            }

            .table-data {
                margin-top: 20px;
                background: none;
                width: 100%;

                ul {
                    padding: 0;
                }

                li {
                    list-style-type: none;
                }
            }

        }
    }
}
</style>