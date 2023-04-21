<template>
    <div class="right-contant-container">
        <el-icon class="fold-icon" @click="toggleFold">
            <Expand v-if="unfold" />
            <Fold v-else />
        </el-icon>
        <div class="right-contant" v-show="unfold">
            <el-steps direction="vertical" :active="activeStep" class="steps">
                <el-step :class="activeStep === 1 ? 'active-step' : 'step'">
                    <template #title>
                        <InputGrammar />
                    </template>
                </el-step>
                <el-step :class="activeStep === 2 ? 'active-step' : 'step'">
                    <template #title>
                        <el-collapse :model-value=activeName class="collapse">
                            <el-collapse-item title="分析算法选择" name="1">
                                <LL1 v-if="router.currentRoute.value.path !== '/'" />
                                <div v-else v-for="item in analysisItems" :key="item.text">
                                    <span class="jump" @click="jump(item)">{{ item.text }}</span>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </template></el-step>
            </el-steps>
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
import { computed, ref, watch } from "vue";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import InputGrammar from '@/components/Right/InputGrammar.vue';
import LL1 from '@/components/Right/LL1.vue';
import { mode, analysisItems } from '@/dataList.js';
import lucy from "lucy-compiler";
import { ElMessage } from 'element-plus';
const store = useStore();
const router = useRouter();

const unfold = ref(true);
const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

// const activeStep = ref(1);

const activeStep = computed(() => {
    return store.getters["grammarStore/getStep"];
})

const activeName = ref('1');

const toggleFold = () => {
    unfold.value = !unfold.value;
}

const goBack = () => {
    router.push({ path: '/', query: { step: 1 } })
}

const isModify = ref(true);

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.state.grammarStore.terminal;
})

const jump = (item) => {
    const { route, params, key } = item;
    if (!route) {
        return;
    }
    if (activeStep.value < 2) {
        ElMessage({
            message: '请先输入文法',
            type: 'warning',
        });
        return;
    }
    const lR = store.getters["grammarStore/getLRParser"];
    const ll1 = store.getters["grammarStore/getLL1Parser"];
    if (key === 'LL1' && (isModify.value || !ll1)) {
        const ll1Parser = new lucy.LL1Parser(terminal.value, nonTerminal.value, grammar.value);
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
    router.push({ path: route, query: params });
    isModify.value = false;
}

watch(() => activeStep, (newValue) => {
    if (newValue.value === 2) {
        activeName.value = "1";
    }
}, {
    immediate: true,
    deep: true
})

watch([() => nonTerminal.value, terminal, grammar], () => {
    isModify.value = true;
}, {
    deep: true
}
);
</script>

<style scoped lang="less">
.right-contant-container {
    background-color: #fff;
    position: relative;
    // border-left: 1px solid rgb(219, 219, 219);
    // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

    .fold-icon {
        position: absolute;
        right: 25px;
        top: 18px;
        font-size: 18px;
        cursor: pointer;
        z-index: 1;
    }

    .right-contant {
        height: 100%;
        width: 420px;
        padding: 15px 20px;
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

            :global(.el-step) {
                min-height: 60px;
                // padding-bottom: 10px;
            }

            :global(.el-step__description) {
                overflow: auto;
                max-height: 95%;
                padding-bottom: 10px;
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