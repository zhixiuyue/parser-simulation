<template>
    <div class="input-container">
        <div class="input-grammar">
            <div class="step" :class="{ 'active-step': step === 1 }">Step1 请先完成文法定义：</div>
            <div class="wrapper" :class="{ 'wrapper-simple': radioMode === 'simple' }">
                <span class="mode">模式选择</span>
                <el-radio-group v-model="radioMode" class="radio">
                    <el-radio label="simple">{{ mode.simple.text }}</el-radio>
                    <el-radio label="custom">{{ mode.custom.text }}</el-radio>
                </el-radio-group>
                <div class="statement">
                    {{ mode[radioMode].statement }}
                </div>
                <span class="input-title">{{ step=== 1 ? '输入' : '' }}文法</span>
                <el-input v-if="step === 1" class="input-area" type="textarea" :autosize="{ minRows: 10, maxRows: 12 }"
                    ref="inputRef" placeholder="A => A c | A a d | b d | ε （所有token需要输入空格分割）" v-model="inputGrammar">
                </el-input>
                <ol v-else class="input-area" style="margin-left: 17px;">
                    <li v-for="item in grammar" :key="item" class="grammar-li">{{ item }}</li>
                </ol>
                <span class="input-title-none" v-if="radioMode === 'custom'">{{ step=== 1 ? '输入' : ''}}非终结符</span>
                <div class="input-none" v-if="radioMode === 'custom' && step === 1">
                    <el-tag v-for="tag in noneTer.values" :key="tag" closable :disable-transitions="false" size="large"
                        @close="handleClose(noneTer.values, tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="noneTer.inputVisible" class="input-none-ter" ref="InputNoneTerRef"
                        v-model="noneTer.inputValue" @keyup.enter="handleInputConfirm(noneTer)"
                        @blur="handleBlur(noneTer)" />
                    <el-button v-else class="btn-nonr-ter" @click="showInputNoneTer">
                        点击新增
                    </el-button>
                </div>
                <div class="input-none" v-if="radioMode === 'custom' && step === 2">
                    <span v-for="item in nonTerminal" :key="item">{{ item }}</span>
                </div>
                <span class="input-title-ter" v-if="radioMode === 'custom'">{{ step=== 1 ? '输入' : ''}}终结符</span>
                <div class="input-ter" v-if="radioMode === 'custom' && step === 1">
                    <el-tag v-for="tag in Ter.values" :key="tag" closable :disable-transitions="false" size="large"
                        @close="handleClose(Ter.values, tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="Ter.inputVisible" class="input-none-ter" ref="InputTerRef" v-model="Ter.inputValue"
                        @keyup.enter="handleInputConfirm(Ter)" @blur="handleBlur(Ter)" />
                    <el-button v-else class="btn-nonr-ter" @click="showInputTer">
                        点击新增
                    </el-button>
                </div>
                <div class="input-ter" v-if="radioMode === 'custom' && step === 2">
                    <span v-for="item in terminal" :key="item">{{ item }}</span>
                </div>
                <el-button v-if="step === 1" class="btn-save" type="primary" plain
                    @click="handleGrammar">输入完成</el-button>
                <el-button v-if="step === 2" class="btn-save" :icon="Edit" @click="handleInputGrammar">重新定义</el-button>
            </div>
            <div class="step-unfinish" :class="{ 'active-step': step === 2 }">Step2 请选择分析过程：</div>
            <div class="analysis" :class="{ 'link-unfinish': step < 2 }">
                <a v-for="item in analysisItems" @click="jump(item.route, item.params)" :key="item.text">
                    {{ item.text }}
                </a>
            </div>
            <!-- <div v-if="displayType === 'LL1'" class="compute">
            <div class="compute-result">
                <span class="compute-title">1、提取左公因子</span>
                <div class="left-factor">
                    S -> a S b S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    L -> L , S
                    <br />
                    | S
                </div>
            </div>
            <div class="compute-result"><span class="compute-title">2、消除左递归</span>
                <div class="left-factor">
                    S -> a S b S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    | b S a S
                    <br />
                    | ϵ
                    <br />
                    L -> L , S
                    <br />
                    | S
                    <br />
                    L -> L , S
                    <br />
                    | S
                </div>
            </div>
        </div> -->
        </div>
        <RightTips type="examples" :mode="radioMode" />
        <FormatTips v-if="showDialog" :dialogVisible="showDialog" :needHandle="needHandle" @saveGrammar="saveGrammar"
            @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import FormatTips from '@/components/FormatTip.vue';
import lucy from "lucy-compiler";
import { reactive, ref, nextTick, computed } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Edit } from '@element-plus/icons-vue'
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();
const showDialog = ref(false);
// const needHandle = reactive({
//     needUnion: true,
//     needLiftUp: true,
//     needClearRecursion: false
// })
const needHandle = ref([]);
const step = ref(store.state.grammarStore.grammar.length ? 2 : 1);
const inputRef = ref();
const inputGrammar = ref('');
const radioMode = ref('simple');
const mode = reactive({
    simple: {
        text: '默认模式',
        statement: `该模式仅支持教学意义的简单文法，所有非终结符的格式为大写字母（A-Z）或带上标的大写字母（A'-Z'、A''-Z''...）,
        所有终结符为小写字母（a-z）或Greek Symbols（ε,μ...），如需要自定义终结符和非终结符，请切换自定义模式`
    },
    custom: {
        text: '自定义模式',
        statement: '该模式支持自定义文法，需要输入自定义终结符和非终结符，请在文法下方输入自定义终结符和非终结符，如不需要自定义，请切换简单模式'
    }
})

const analysisItems = reactive([
    {
        text: "LL(1)分析表构造",
        route: '/LL1Table',
    },
    {
        text: "LR(0)分析表构造",
        route: '/LR0Table',
        params: { type: 'LR0' }
    },
    {
        text: "SLR(1)分析表构造",
        route: 'LR0Table',
        params: { type: 'SLR1' }
    },
    {
        text: "LL(1)预测分析",
        route: '/LL1Analysis',
    },
    {
        text: "LR(0)模拟分析",
        route: '/LR0Analysis',
        params: { type: 'LR0' }
    },
    {
        text: "SLR(1)模拟分析",
        route: '/LR0Analysis',
        params: { type: 'SLR1' }
    },
    {
        text: "LR(0)自动机构造",
        route: '/Automaton',
    },
])

const InputNoneTerRef = ref();
const InputTerRef = ref();
const noneTer = reactive({
    values: [],
    inputValue: '',
    inputVisible: false,
})
const Ter = reactive({
    values: [],
    inputValue: '',
    inputVisible: false,
})

const grammar = computed(() => {
    return store.state.grammarStore.grammar;
})

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.getters["grammarStore/getTerminal"];
})

const onClose = () => {
    showDialog.value = false;
    finishInput();
}

const finishInput = () => {
    step.value++;
}

const handleClose = (tags, tag) => {
    tags.splice(tags.indexOf(tag), 1);
}

const showInputNoneTer = () => {
    noneTer.inputVisible = true;
    nextTick(() => {
        InputNoneTerRef.value.input.focus();
    })
}
const showInputTer = () => {
    Ter.inputVisible = true;
    nextTick(() => {
        InputTerRef.value.input.focus();
    })
}

const handleInputConfirm = (tags) => {
    if (tags.inputValue.trim()) {
        tags.values.push(tags.inputValue);
    }
    tags.inputValue = '';
}

const handleBlur = (tags) => {
    handleInputConfirm(tags);
    tags.inputVisible = false;
}

const saveGrammar = (garmmar) => {
    if (radioMode.value === 'simple') {
        try {
            const { nonTerminals, terminals } = lucy.getTockFromSimpleGrammers(garmmar);
            saveNonTerminal(nonTerminals);
            saveTerminal(terminals);
        } catch (error) {
            ElMessage({
                message: '存在非法字符，请检查或切换自定义模式',
                type: 'error',
            });
            return;
        }
    } else {
        if (noneTer.values) {
            saveNonTerminal(noneTer.values);
        }
        if (Ter.values) {
            saveTerminal(Ter.values);
        }
    }
    store.commit("grammarStore/updateGrammar", garmmar);
}

const saveMode = () => {
    store.commit("grammarStore/updateCustomMode", radioMode === 'custom');
}

const saveNonTerminal = (value) => {
    store.commit("grammarStore/updateNonTerminal", value);
}

const saveTerminal = (value) => {
    store.commit("grammarStore/updateTerminal", value);
}

const pushGrammar = (item, grammar) => {
    if (!grammar.length || !item) {
        return '';
    }
    let str = `${item} =>`;
    grammar.forEach((val, index) => {
        val.forEach(token => {
            str += ` ${token}`;
        })
        if (index < grammar.length - 1) {
            str += ` |`
        }
    })
    return str;
}

const handleInputGrammar = () => {
    step.value--;
    let value = '';
    if (!grammar.value.length) {
        return;
    }
    grammar.value.forEach((val) => {
        value += val;
        value += '\n';
    })
    inputGrammar.value = value;
    noneTer.values = nonTerminal.value;
    Ter.values = terminal.value;
}

const handleGrammar = () => {
    if (!inputGrammar.value.trim()) {
        ElMessage({
            message: '请先输入文法',
            type: 'warning',
        });
        return;
    }
    if (radioMode === 'custom') {
        if (!noneTer.values.length) {
            ElMessage({
                message: '请输入非终结符',
                type: 'warning',
            });
            return;
        }
        if (!Ter.values.length) {
            ElMessage({
                message: '请输入终结符',
                type: 'warning',
            });
            return;
        }
    }
    let index = 0,
        grammar = [],
        head = null,
        tokens = inputGrammar.value.split(/\s+/).filter(function (token) {
            return token.length > 0;
        });
    let grammars = [];
    while (index < tokens.length) {
        if (index + 1 < tokens.length && tokens[index + 1] === '=>') {
            const result = pushGrammar(head, grammar);
            if (result) {
                grammars.push(result);
            }
            head = tokens[index];
            index += 2;
            grammar = [[]];
        } else if (tokens[index] === '|') {
            if (!head || !grammar) {
                ElMessage('文法格式错误，请检查');
                inputRef.value && inputRef.value.focus();
                return;
            }
            grammar.push([]);
            index += 1;
        } else {
            if (!head || !grammar) {
                ElMessage('文法格式错误，请检查');
                inputRef.value && inputRef.value.focus();
                return;
            }
            grammar[grammar.length - 1].push(tokens[index]);
            index += 1;
        }
    }
    const result = pushGrammar(head, grammar);
    if (result) {
        grammars.push(result);
    }
    console.log(grammars);
    saveGrammar(grammars);
    saveMode();
    needHandle.value = [];
    lucy.checkNeedunionGrammers(grammars) && needHandle.value.push('needUnion');
    lucy.checkNeedliftUpCommonTocken(grammars) && needHandle.value.push('needLiftUp');
    lucy.checkNeedClearRightRecursion(grammars) && needHandle.value.push('needClearRecursion');
    if (needHandle.value.length > 0) {
        showDialog.value = true;
    } else {
        finishInput();
    }
}

const jump = (route, params) => {
    if (!route) {
        return;
    }
    if (step.value < 2) {
        ElMessage({
            message: '请先输入文法',
            type: 'warning',
        });
        inputRef.value && inputRef.value.focus();
        return;
    }
    router.push({ path: route, query: params })
}

</script>    

<style scoped lang="less">
.input-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .input-grammar {
        height: 100%;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        flex: 1;

        .step {
            font-size: 18px;
            font-weight: 600;
        }

        .step-unfinish {
            color: #B3C0D1;
            font-weight: 600;
            font-size: 18px;
            margin-top: 10px;
        }

        .active-step {
            color: #537FE7;
        }


        .wrapper {
            display: grid;
            grid-template-columns: 100px calc(100% - 100px);
            grid-gap: 15px 10px;
            grid-template-areas:
                "mode radio"
                ". statement"
                "input-title input-area"
                "input-title-none input-none"
                "input-title-ter input-ter"
                ". btn-save";

            .mode {
                grid-area: mode;
                line-height: 33px;
            }

            .radio {
                grid-area: radio;

                :global(.el-radio__label) {
                    font-size: 16px;
                }
            }

            .statement {
                grid-area: statement;
                font-size: 14px;
            }

            .input-title {
                grid-area: input-title;
            }

            .input-area {
                grid-area: input-area;
                padding: 0;
                margin: 0;
            }

            .grammar-li {
                line-height: 25px;
            }

            .input-title-none {
                grid-area: input-title-none;
                line-height: 33px;
            }


            .input-none-ter,
            .btn-nonr-ter {
                width: 80px;
            }

            .input-none {
                grid-area: input-none;
            }

            .input-title-ter {
                grid-area: input-title-ter;
                line-height: 33px;
            }

            .input-ter {
                grid-area: input-ter;
            }

            .input-none,
            .input-ter {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                align-items: center;

            }

            .btn-save {
                grid-area: btn-save;
                width: fit-content;
                margin-top: 10px;
            }
        }

        .wrapper-simple {
            grid-template-areas:
                "mode radio"
                ". statement"
                "input-title input-area"
                ". btn-save";
        }

        :deep(.el-textarea__inner) {
            border: none;
            background: none;
            resize: none;
            font-family: initial;
        }

        .analysis {
            margin-left: 110px;
            display: grid;
            grid-gap: 10px;
            grid-template-columns: 200px 200px 200px;

            a {
                text-decoration: underline;
                cursor: pointer;

                &:hover {
                    color: #409eff;
                }
            }
        }

        .link-unfinish a {
            color: #B3C0D1;

            &:hover {
                color: #B3C0D1;
            }
        }

        .compute {
            display: flex;
            margin-top: 10px;
            height: 0;
            flex: 1;

            .compute-result {
                width: 50%;
                display: flex;
                flex-direction: column;

                .compute-title {
                    flex: 0;
                }

                .left-factor {
                    margin: 10px 0 0 20px;
                    flex: 1;
                    height: 0;
                    overflow-y: auto;

                    // &::-webkit-scrollbar {
                    //     display: none;
                    // }
                }
            }
        }
    }
}
</style>
