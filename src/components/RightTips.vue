<template>
    <div class="right-contant-container">
        <el-icon class="fold-icon" @click="toggleFold">
            <Expand v-if="unfold" />
            <Fold v-else />
        </el-icon>
        <div class="right-contant" v-if="unfold">
            <el-steps direction="vertical" :active="activeStep" class="steps">
                <el-step :class="activeStep === 1 ? 'active-step' : 'step'">
                    <template #title>
                        <InputGrammar />
                    </template>
                </el-step>
                <el-step :class="activeStep === 2 ? 'active-step' : 'step'">
                    <template #title>
                        <el-collapse model-value="1" class="collapse">
                            <el-collapse-item title="分析算法选择" name="1">
                                <div v-for="item in analysisItems" :key="item.text">
                                    <span class="jump" @click="jump(item)">{{ item.text }}</span>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </template></el-step>
            </el-steps>
            <div v-if="type === 'grammar'">
                <div class="title">
                    <span class="support-grammers-title">文法</span>
                    <el-icon class="icon" @click="goBack">
                        <Edit />
                    </el-icon>
                </div>
                <ul class="support-grammers-list">
                    <li v-for="item in grammar" :key="item">{{ item }}</li>
                </ul>
            </div>
            <div v-if="showArgument">
                <div class="argument-title">增广文法</div>
                <div class="argument-statement">假定文法G是一个以S为开始符号的文法，构造一个新的文法G‘,称G'是G的增广文法，G'定义如下：</div>
                <ul class="argument-ul">
                    <li>只增加一个新的非终结符S’(G‘的开始符号)；</li>
                    <li>增加一个新的产生式S’->S；</li>
                    <li>增广文法会有一个仅含项目S'->S·的状态，这是唯一的接受态；</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import InputGrammar from '@/components/Right/InputGrammar.vue';
import { mode, analysisItems, LRRoute } from '@/dataList.js';
import { ElMessage } from 'element-plus';
const store = useStore();
const router = useRouter();

const unfold = ref(true);
const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const activeStep = ref(1);

const props = defineProps({
    mode: {
        type: String,
    },
    showArgument: {
        type: Boolean,
    }
})

const toggleFold = () => {
    unfold.value = !unfold.value;
}

const goBack = () => {
    router.push({ path: '/', query: { step: 1 } })
}

// TODO
const jump = (item) => {
    const { route, params, key } = item;
    if (!route) {
        return;
    }
    if (step.value < 2) {
        ElMessage({
            message: '请先输入文法',
            type: 'warning',
        });
        // inputRef.value?.textarea?.focus();
        return;
    }
    const lR = store.getters["grammarStore/getLRParser"];
    const ll1 = store.getters["grammarStore/getLL1Parser"];
    if (key === 'LL1' && (isModify.value || !ll1)) {
        const terminal = store.state.grammarStore.terminal;
        const ll1Parser = new lucy.LL1Parser(terminal, nonTerminal.value, grammar.value);
        const firstSet = ll1Parser.getFirstSet();
        const followSet = ll1Parser.getFollowSet(firstSet);
        // const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
        store.commit("grammarStore/updateLL1Parser", ll1Parser);
        store.commit("grammarStore/updateFirstSet", firstSet);
        store.commit("grammarStore/updateFollowSet", followSet);
    } else if (key === 'LR0' && (isModify.value || !lR)) {
        const lRParser = new lucy.LRParser();
        store.commit("grammarStore/updateLRParser", lRParser);
    }
    router.push({ path: key === 'LR0' ? LREnterRoute.value : route, query: params });
}

</script>

<style scoped lang="less">
.right-contant-container {
    background-color: #fff;
    position: relative;
    // border-left: 1px solid rgb(219, 219, 219);

    .fold-icon {
        position: absolute;
        right: 20px;
        top: 18px;
        font-size: 18px;
        cursor: pointer;
        z-index: 1;
    }

    .right-contant {
        height: 100%;
        width: 400px;
        padding: 15px;
        overflow: auto;

        .steps {
            max-height: 100%;
            height: fit-content;
            min-height: 20%;

            .collapse {
                border: none;
                --el-collapse-header-height: 26px;
                --el-collapse-header-font-size: 17px;

                .jump {
                    text-decoration: underline;
                    cursor: pointer;
                    color: #409eff;
                    font-weight: 400;
                    font-size: 14px;

                    &:hover {
                        opacity: 0.8;
                    }
                }
            }

            :global(.el-step__description) {
                overflow: auto;
                max-height: 95%;
            }

            :global(.el-step__description.is-finish) {
                color: #000;
            }

            .active-step {
                height: 0;
                flex: 1;
            }

            .step {
                flex: 0;
            }
        }

        .title {
            display: flex;
            align-items: center;
            gap: 10px;

            .icon {
                cursor: pointer;
            }
        }

        .argument-title {
            font-weight: 600;
        }

        .argument-statement {
            font-size: 14px;
            margin: 10px;
        }

        .argument-ul {
            font-size: 14px;

            li+li {
                margin-top: 10px;
            }
        }
    }
}
</style>