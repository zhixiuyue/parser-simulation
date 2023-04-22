<template>
    <el-collapse :model-value=activeName class="collapse">
        <el-collapse-item title="文法定义" name="1">
            <div class="examples">
                <div class="mode-title">
                    <span class="mode">{{ mode[Number(openCustomMode)]?.text }}</span>
                    <el-switch v-model="openCustomMode" inline-prompt active-text="自定义" inactive-text="默认" />
                </div>
                <div class="statement">
                    {{ mode[Number(openCustomMode)]?.statement }}
                </div>
                <!-- <div class="support-grammers">
                                <span class="support-grammers-title">支持的文法输入格式</span>
                                <ul class="support-grammers-list">
                                    <li v-for="item in mode[Number(openCustomMode)]?.grammars" :key="item">{{ item }}
                                    </li>
                                </ul>
                            </div> -->
                <!-- <div class="support-grammers">
                    <span class="support-grammers-title">例子</span>
                    <ul class="support-grammers-list">
                        <li v-for="item in mode[Number(openCustomMode)]?.examples" :key="item">{{
                            item
                        }}
                        </li>
                    </ul>
                </div> -->
                <div class="wrapper">
                    <div class="input-symbol" v-if="openCustomMode">
                        <span class="input-title-none">非终结符</span>
                        <div class="input-none">
                            <el-tag v-for="tag in noneTer.values" :key="tag" closable :disable-transitions="false"
                                size="large" @close="handleClose(noneTer.values, tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="noneTer.inputVisible" class="input-none-ter" ref="InputNoneTerRef"
                                v-model="noneTer.inputValue" @keyup.enter="handleInputConfirm(noneTer)"
                                @blur="handleBlur(noneTer)" />
                            <el-button v-else :icon="Plus" circle size="small" @click="showInputNoneTer"
                                :disabled="activeStep > 1" />
                        </div>
                    </div>

                    <div class="input-symbol" v-if="openCustomMode">
                        <span class="input-title-ter">终结符</span>
                        <div class="input-ter">
                            <el-tag v-for="tag in Ter.values" :key="tag" closable :disable-transitions="false"
                                size="large" @close="handleClose(Ter.values, tag)">
                                {{ tag }}
                            </el-tag>
                            <el-input v-if="Ter.inputVisible" class="input-none-ter" ref="InputTerRef"
                                v-model="Ter.inputValue" @keyup.enter="handleInputConfirm(Ter)"
                                @blur="handleBlur(Ter)" />
                            <el-button v-else :icon="Plus" circle size="small" @click="showInputTer"
                                :disabled="activeStep > 1" />
                        </div>
                    </div>

                    <div>
                        <el-input class="input-area" type="textarea" :autosize="{ minRows: 11, maxRows: 13 }"
                            ref="inputRef" :placeholder="'例子\n' + mode[Number(openCustomMode)]?.examples.join('\n')"
                            v-model="inputGrammar" :disabled="activeStep > 1">
                        </el-input>
                    </div>
                    <el-button v-if="activeStep === 1" class="btn-save" type="primary" plain
                        @click="handleGrammar">确定</el-button>
                    <el-button v-else class="btn-save" :icon="Edit" @click="reDefine">重定义</el-button>
                </div>
            </div>
        </el-collapse-item>
    </el-collapse>
</template>

<script setup>
import { mode } from '@/dataList.js';
import { computed, ref, reactive, nextTick, watch } from "vue";
import { Plus, Edit } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import lucy from "lucy-compiler";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const specialChar = ['(', ')', '[', ']', '{', '}', '/', '\\', '.', '*', '?', '+', '^', '$'];
const store = useStore();
const InputNoneTerRef = ref();
const InputTerRef = ref();
const openCustomMode = ref(false);
const inputGrammar = ref('');
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

const activeName = ref('1');

const handleClose = (tags, tag) => {
    tags.splice(tags.indexOf(tag), 1);
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

const showInputNoneTer = () => {
    noneTer.inputVisible = true;
    nextTick(() => {
        InputNoneTerRef.value?.input?.focus();
    })
}

const showInputTer = () => {
    Ter.inputVisible = true;
    nextTick(() => {
        InputTerRef.value?.input?.focus();
    })
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

const saveNonTerminal = (value) => {
    store.commit("grammarStore/updateNonTerminal", value);
}

const saveTerminal = (value) => {
    store.commit("grammarStore/updateTerminal", value);
}

const saveGrammar = (garmmar) => {
    if (!openCustomMode.value) {
        try {
            const { nonTerminals, terminals } = lucy.getTockFromSimpleGrammers(garmmar);
            saveNonTerminal(nonTerminals);
            saveTerminal(terminals);
        } catch (error) {
            ElMessage({
                message: '存在非法字符，请检查或切换自定义模式',
                type: 'error',
            });
            throw new Error('Error');
        }
    } else {
        if (noneTer.values) {
            saveNonTerminal(noneTer.values);
        }
        if (Ter.values) {
            const arr = Ter.values.map((item) => {
                let regExp = '';
                for (let i = 0; i < item.length; i++) {
                    const value = item[i];
                    if (specialChar.includes(value)) {
                        regExp += `\\${value}`;
                    } else {
                        regExp += value;
                    }
                }
                return [
                    item,
                    new RegExp(`^${regExp}`)
                ]
            })
            saveTerminal(arr);
        }
    }
    store.commit("grammarStore/updateGrammar", garmmar);
    store.commit("grammarStore/updateCustomMode", openCustomMode);
    store.commit("grammarStore/updateInitialGrammar", []);
}

const handleGrammar = () => {
    if (!inputGrammar.value.trim()) {
        ElMessage({
            message: '请先输入文法',
            type: 'warning',
        });
        return;
    }
    if (openCustomMode.value) {
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
                inputRef.value?.textarea?.focus();
                return;
            }
            grammar.push([]);
            index += 1;
        } else {
            if (!head || !grammar) {
                ElMessage('文法格式错误，请检查');
                inputRef.value?.textarea?.focus();
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
    store.commit("grammarStore/updateStep", 2);
}

const activeStep = computed(() => {
    return store.getters["grammarStore/getStep"];
})

const reDefine = () => {
    store.commit("grammarStore/updateStep", 1);
}

watch(() => activeStep, (newValue) => {
    if (newValue.value === 1) {
        activeName.value = "1";
        router.push('/');
    } else if (newValue.value === 2) {
        activeName.value = "";
    }
}, {
    immediate: true,
    deep: true
})
</script>

<style scoped lang="less">
.collapse {
    border: none;
    --el-collapse-header-height: 26px;
    --el-collapse-header-font-size: 17px;

    :global(.el-collapse-item__header) {
        font-weight: 600;
        border: none;
        padding-right: 25px;
    }

    :global(.el-collapse-item__content) {
        padding: 10px;
    }

    :global(.el-collapse-item__wrap) {
        border-bottom: none;
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
            font-size: 16px;
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

    .wrapper {
        font-size: 14px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 0 10px;

        .input-symbol {
            display: flex;
            align-items: center;
            gap: 10px;

            .input-title-none,
            .input-title-ter {
                flex: 0 0 fit-content;
            }
        }

        .mode {
            grid-area: mode;
            line-height: 33px;
        }

        .input-area {
            padding: 0;
            margin: 0;
        }

        :deep(.el-textarea__inner) {
            border: none;
            background: none;
            resize: none;
            font-family: initial;
        }

        .input-none-ter {
            width: 80px;
        }

        .input-none,
        .input-ter {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;

        }

        .btn-save {
            width: fit-content;
            margin-left: auto;
        }
    }
}
</style>