<template>
    <div class="right-LL1">
        <div class="title">LL(1)分析
            <el-tooltip class="box-item" effect="dark" content="切换至LR(0)分析" placement="top">
                <el-icon @click="toLR0">
                    <Switch />
                </el-icon>
            </el-tooltip>
        </div>
        <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step v-for="(item, index) in LLRoute" :key="item.text" :title="item.text" :icon="Finished">
                <template #title>
                    <div class="step-title">
                        <span>{{ item.text }}</span>
                        <el-tooltip v-if="index === 0" effect="dark" :content="ignoreGrammarJudge ? '展开此步骤' : '忽略此步骤'"
                            placement="top">
                            <el-icon @click="handleIgnore">
                                <Remove />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
                <template #description>
                    <div v-if="index === 0 && !ignoreGrammarJudge">
                        <div class="rules">
                            <span>LL(1)文法判断规则</span>
                            <span>
                                1、对于每一个产生式 A → α1|α2|…|αn, FIRST(αi) ∩ FIRST(αj) = Φ, 对于所有的 i 和 j, 有1≤i, j ≤ n, i≠j
                            </span>
                            <span>
                                2、对于每一个非终结符 A , 如果 FIRST(A) 包含 ε, FIRST(A) ∩ FOLLOW(A) = Φ
                            </span>
                        </div>
                        <el-button class="btn-save" type="primary" plain @click="jump(0)">自动判定</el-button>
                    </div>
                    <div v-if="index === 1">
                        <div class="jump" @click="jump(1, { type: 0 })">计算First Set和Follow Set
                            <el-tooltip class="box-item" effect="dark" :content="ignoreSet ? '展开此步骤' : '忽略此步骤'"
                                placement="top">
                                <el-icon @click="handleIgnoreSet">
                                    <Remove />
                                </el-icon>
                            </el-tooltip>
                        </div>
                        <div class="jump" @click="jump(1)">LL(1)分析表构建</div>
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
import { LLRoute } from '@/dataList.js';
import { Finished } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { genLR0 } from '@/genParser.js';

const store = useStore();
const active = ref(0);
const router = useRouter();
const inputString = ref('');
const ignoreGrammarJudge = ref(false);
const ignoreSet = ref(false);

const handleIgnore = () => {
    ignoreGrammarJudge.value = !ignoreGrammarJudge.value;
}

const handleIgnoreSet = (e) => {
    e.stopPropagation();
    ignoreSet.value = !ignoreSet.value;
    store.commit("grammarStore/updateHideFirset", ignoreSet.value);
}

const jump = (index, params) => {
    active.value = index;
    if (params) {
        router.push({ path: LLRoute[index].route, query: params });
    } else {
        router.push(LLRoute[index].route);
    }
}

const onFinishInput = () => {
    if (!inputString.value) {
        return;
    }
    store.commit("grammarStore/updateLL1ParserString", inputString.value);
    jump(2);
};

const toLR0 = () => {
    const lR = store.getters["grammarStore/getLRParser"];
    if (!lR) {
        genLR0();
    }
    router.push('/LR0');
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

    .step-title {
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            cursor: pointer;
        }
    }

    .rules {
        display: flex;
        flex-direction: column;
        gap: 10px;
        font-size: 14px;
        padding: 10px 0;
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
        display: flex;
        align-items: center;
        gap: 10px;
        width: fit-content;

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