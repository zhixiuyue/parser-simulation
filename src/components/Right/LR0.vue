<template>
    <div class="right-LL1">
        <div class="title">LR(0)分析
            <el-tooltip class="box-item" effect="dark" content="切换至LL(1)分析" placement="top">
                <el-icon @click="toLL1">
                    <Switch />
                </el-icon>
            </el-tooltip>
        </div>
        <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step v-for="(item, index) in LRRoute" :key="item.text" :title="item.text" :icon="Finished"
                class="el-step">
                <template #description>
                    <div v-if="index === 0">
                        <div class="rules">
                            <div>增广文法定义</div>
                            <div class="argument-statement">假定文法G是一个以S为开始符号的文法，构造一个新的文法G‘,称G'是G的增广文法，G'定义如下：</div>
                            <ul class="argument-ul">
                                <li>只增加一个新的非终结符S’(G‘的开始符号)；</li>
                                <li>增加一个新的产生式S’->S；</li>
                                <li>增广文法会有一个仅含项目S'->S·的状态，这是唯一的接受态；</li>
                            </ul>
                        </div>
                        <el-button class="btn-save" type="primary" plain @click="jump(0)">生成DFA</el-button>
                    </div>
                    <div v-if="index === 1">
                        <div class="jump" @click="jump(1)">LR(0)分析表构建</div>
                    </div>
                    <div v-if="index === 2">
                        <el-input v-model="inputString" placeholder="请输入待分析字符串" clearable class="input-area" />
                        <el-button type="primary" plain class="sure-btn" @click="onFinishInput">开始分析</el-button>
                    </div>
                </template>
            </el-step>
        </el-steps>
    </div>
</template>

<script setup>
import { LLRoute, LRRoute } from '@/dataList.js';
import { Menu, Finished } from '@element-plus/icons-vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import lucy from "lucy-compiler";

const store = useStore();
const active = ref(0);
const router = useRouter();
const inputString = ref('');

const jump = (index) => {
    active.value = index;
    router.push(LRRoute[index].route);
}

const onFinishInput = () => {
    if (!inputString.value) {
        return;
    }
    store.commit("grammarStore/updateLRParsingString", inputString.value);
    jump(2);
};

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.state.grammarStore.terminal;
})

const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const toLL1 = () => {
    const ll1 = store.getters["grammarStore/getLL1Parser"];
    if (!ll1) {
        const ll1Parser = new lucy.LL1Parser(terminal.value, nonTerminal.value, grammar.value);
        const firstSet = ll1Parser.getFirstSet();
        const followSet = ll1Parser.getFollowSet(firstSet);
        // const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
        store.commit("grammarStore/updateLL1Parser", ll1Parser);
        store.commit("grammarStore/updateFirstSet", firstSet);
        store.commit("grammarStore/updateFollowSet", followSet);
    }
    router.push(LLRoute[0].route);
}
</script>

<style lang="less" scoped>
.right-LL1 {
    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            cursor: pointer;
        }
    }

    .step-icon {
        :global(.el-step__icon svg) {
            width: 20px;
            height: 20px;
        }
    }

    :global(.el-step__description.is-success) {
        color: #000;
    }

    .rules {
        font-size: 14px;
        padding: 10px 0;

        .argument-statement {
            margin: 10px;
        }

        .argument-ul {

            li+li {
                margin-top: 10px;
            }
        }
    }

    .btn-save {
        float: right;
    }

    .jump {
        margin-top: 10px;
        text-decoration: underline;
        cursor: pointer;
        color: #409eff;
        font-weight: 400;
        font-size: 14px;

        &:hover {
            opacity: 0.8;
        }
    }

    .input-area {
        width: 290px;
        margin-top: 10px;
    }

    .sure-btn {
        float: right;
        margin-top: 10px;
    }
}
</style>