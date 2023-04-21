<template>
    <div class="right-LL1">
        <div class="title">LL1分析</div>
        <el-steps direction="vertical" :active="active" finish-status="success">
            <el-step v-for="(item, index) in LLRoute" :key="item.text" :title="item.text" :icon="Finished"
                class="el-step">
                <template #description>
                    <div v-if="index === 0">
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
                        <div class="jump" @click="jump(1)">计算First Set和Follow Set</div>
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
import { LLRoute, LRRoute } from '@/dataList.js';
import { Menu, Finished } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const active = ref(1);
const router = useRouter();
const inputString = ref('');

const jump = (index) => {
    router.push(LLRoute[index].route);
}

const onFinishInput = () => {
    if (!inputString.value) {
        return;
    }
    store.commit("grammarStore/updateLL1ParserString", inputString.value);
    jump(2);
};
</script>

<style lang="less" scoped>
.right-LL1 {
    .title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 5px;
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