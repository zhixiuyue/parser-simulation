<template>
    <div class="input-container">
        <div class="title">
            <span class="input-title">文法</span>
            <el-icon class="icon" @click="goBack">
                <Edit />
            </el-icon>
        </div>
        <div class="grammar">
            <div class="wrapper" :class="{ 'wrapper-simple': !isCustomMode }">
                <span class="input-title-none" v-if="isCustomMode">非终结符</span>
                <div class="input-none" v-if="isCustomMode">
                    <span v-for="item in nonTerminal" :key="item">{{ item }}</span>
                </div>
                <span class="input-title-ter" v-if="isCustomMode">终结符</span>
                <div class="input-ter" v-if="isCustomMode">
                    <span v-for="item in terminal" :key="item">{{ item }}</span>
                </div>
                <ol v-if="showGrammar.length" class="input-area">
                    <li v-for="item in showGrammar" :key="item" class="grammar-li">{{
                        item
                    }}
                    </li>
                    <el-tooltip class="box-item" effect="dark" :content="tooltip.content" placement="top"
                        v-if="tooltip.if">
                        <el-icon class="initial" @click="tooltip.click">
                            <RefreshRight />
                        </el-icon>
                    </el-tooltip>
                </ol>
                <div v-else>请输入文法</div>
            </div>
        </div>
        <!-- <RightTips type="examples" :mode="radioMode" /> -->
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Edit } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
const router = useRouter();

const store = useStore();

const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const showInitail = computed(() => {
    return store.getters["grammarStore/getShowInitail"];
})

const initialGrammar = computed(() => {
    return store.getters["grammarStore/getInitialGrammar"];
})

const showArgument = computed(() => {
    return store.getters["grammarStore/getShowArgument"];
})

const path = computed(() => {
    return router.currentRoute.value.path.split('/')[1];
})

const argument = computed(() => {
    return store.getters["grammarStore/getArgument"];
})

const showGrammar = computed(() => {
    if (path.value === 'LR0') {
        const startGrammar = store.getters["grammarStore/getStartGrammar"];
        return showArgument.value ? [argument.value, ...startGrammar] : startGrammar;
    }
    else if (path.value === 'LL1') {
        return showInitail.value ? initialGrammar.value : grammar.value;
    }
    return grammar.value;
})

const tooltip = computed(() => {
    if (path.value === 'LR0') {
        return {
            content: showArgument.value ? '查看原始文法' : '查看增广文法',
            if: argument.value,
            click: () => {
                store.commit("grammarStore/updateShowArgument", !showArgument.value);
            }
        }
    }
    // else if (path.value === 'LL1') {
    return {
        content: showInitail.value ? '查看改写文法' : '查看原始文法',
        if: initialGrammar.value.length,
        click: () => {
            store.commit("grammarStore/updateShowInitail", !showInitail.value);
        }
    }
    // }
    // return {}
})

// const showInitail = ref(false);
const transfer = () => {
    store.commit("grammarStore/updateShowInitail", !showInitail.value);
}

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.getters["grammarStore/getTerminal"];
})

const isCustomMode = computed(() => {
    return store.getters["grammarStore/getCustomMode"];
})

const goBack = () => {
    store.commit("grammarStore/updateStep", 1);
}


watch(() => grammar, (newValue) => {
    store.commit("grammarStore/updateShowInitail", false);
}, {
    deep: true
})

</script>    

<style scoped lang="less">
.input-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;

    .title {
        display: flex;
        align-items: center;
        gap: 10px;

        svg {
            cursor: pointer;
        }
    }

    .input-title {
        font-size: 16px;
        font-weight: 600;
    }

    .grammar {
        position: relative;


        .initial {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
        }
    }

    .wrapper {
        display: grid;
        grid-template-columns: 80px calc(100% - 100px);
        grid-gap: 10px 10px;
        grid-template-areas:
            "input-title-none input-none"
            "input-title-ter input-ter"
            ". input-area";
        padding: 10px 15px 20px;

        .input-title {
            grid-area: input-title;
        }

        .input-area {
            grid-area: input-area;
            padding: 10px 25px 10px 40px;
            margin: 0;
            border: 1px solid #dedfe6;
            border-radius: 5px;
            // color: #a8abb2;
            min-height: 100px;
            max-width: 500px;
            position: relative;
        }

        .grammar-li {
            line-height: 25px;
        }

        .input-title-none {
            grid-area: input-title-none;
            line-height: 33px;
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
    }

    .wrapper-simple {
        grid-template-areas:
            ". input-area"
    }

    .analysis {
        margin-left: 110px;
        display: flex;
        flex-direction: column;
        width: fit-content;
        gap: 10px;

        .enter-route {
            margin-left: 20px;
            display: inline-flex;
            align-items: center;
        }
    }

    .link-unfinish a {
        color: #B3C0D1;

        &:hover {
            color: #B3C0D1;
        }
    }
}
</style>
