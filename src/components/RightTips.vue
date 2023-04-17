<template>
    <div class="right-contant-container">
        <el-icon class="fold-icon" @click="toggleFold">
            <Expand v-if="unfold" />
            <Fold v-else />
        </el-icon>
        <div class="right-contant" v-if="unfold">
            <el-steps direction="vertical" :active="activeStep" class="steps">
                <el-step title="文法定义" :class="activeStep === 1 ? 'active-step' : 'step'">
                    <template v-slot:description>
                        <div v-if="activeStep === 1" class="examples">
                            <div class="mode-title">
                                <span class="mode">{{ mode[Number(openCustomMode)]?.text }}</span>
                                <el-switch v-model="openCustomMode" inline-prompt active-text="自定义"
                                    inactive-text="默认" />
                            </div>
                            <div class="statement">
                                {{ mode[Number(openCustomMode)]?.statement }}
                            </div>
                            <div class="support-grammers">
                                <span class="support-grammers-title">支持的文法输入格式</span>
                                <ul class="support-grammers-list">
                                    <li v-for="item in mode[Number(openCustomMode)]?.grammars" :key="item">{{ item }}
                                    </li>
                                </ul>
                            </div>
                            <div class="support-grammers">
                                <span class="support-grammers-title">例子</span>
                                <ul class="support-grammers-list">
                                    <li v-for="item in mode[Number(openCustomMode)]?.examples" :key="item">{{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </template>
                </el-step>
                <el-step title="分析算法选择" :class="activeStep === 2 ? 'active-step' : 'step'" />
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
import { mode } from '@/dataList.js';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const unfold = ref(true);
const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const activeStep = ref(1);
const openCustomMode = ref(false);

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

</script>

<style scoped lang="less">
.right-contant-container {
    background-color: #fff;
    position: relative;
    // border-left: 1px solid rgb(219, 219, 219);

    .fold-icon {
        position: absolute;
        right: 20px;
        top: 15px;
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

            :global(.el-step__description) {
                overflow: auto;
                max-height: 95%;
            }

            :global(.el-step__description.is-finish) {
                color: #000;
            }

            :global(.el-step__title) {
                font-weight: 600;
            }

            .active-step {
                height: 0;
                flex: 1;
            }

            .step {
                flex: 0;
            }

            .examples {
                display: flex;
                flex-direction: column;
                gap: 10px;

                .mode-title {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .mode {
                    font-size: 18px;
                    font-weight: 600;
                }

                .statement {
                    font-size: 14px;
                    padding: 5px 10px;
                }

                .support-grammers {

                    &-title {
                        font-weight: 600;
                        font-size: 15px;
                    }

                    &-list {
                        white-space: pre-line;
                        font-size: 14px;
                        line-height: 1.5;
                    }
                }
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