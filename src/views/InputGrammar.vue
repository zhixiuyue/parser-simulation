<template>
    <div class="input-container">
        <span class="input-title">文法</span>
        <div class="wrapper" :class="{ 'wrapper-simple': !isCustomMode }">
            <span class="input-title-none" v-if="isCustomMode">非终结符</span>
            <div class="input-none" v-if="isCustomMode">
                <span v-for="item in nonTerminal" :key="item">{{ item }}</span>
            </div>
            <span class="input-title-ter" v-if="isCustomMode">终结符</span>
            <div class="input-ter" v-if="isCustomMode">
                <span v-for="item in terminal" :key="item">{{ item }}</span>
            </div>
            <ol v-if="grammar.length" class="input-area" style="margin-left: 17px;">
                <li v-for="item in grammar" :key="item" class="grammar-li">{{ item }}</li>
            </ol>
            <div v-else>请输入文法</div>
        </div>
        <!-- <RightTips type="examples" :mode="radioMode" /> -->
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import lucy from "lucy-compiler";
import { reactive, ref, nextTick, computed, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Edit } from '@element-plus/icons-vue';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return store.getters["grammarStore/getTerminal"];
})

const isCustomMode = computed(() => {
    return store.getters["grammarStore/getCustomMode"];
})

const handleInputGrammar = () => {
    step.value = 1;
    let value = '';
    inputRef.value?.textarea?.focus();
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

const isModify = ref(false);

watch(
    () => router.currentRoute.value.query,
    () => {
        const { step } = router.currentRoute.value.query;
        if (step === '1') {
            handleInputGrammar();
        }
    },
    { immediate: true, deep: true }
);

</script>    

<style scoped lang="less">
.input-container {
    height: 100%;
    padding: 20px 8%;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .input-title {
        font-size: 18px;
        // font-weight: 600;
    }

    .wrapper {
        display: grid;
        grid-template-columns: 80px calc(100% - 100px);
        grid-gap: 10px 10px;
        grid-template-areas:
            "input-title-none input-none"
            "input-title-ter input-ter"
            ". input-area";

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
