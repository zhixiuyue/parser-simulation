<template>
    <div class="judge" v-show="!showInitail">
        <div class="conclusion">
            <el-icon v-if="!isLL1">
                <Warning />
            </el-icon>
            该文法{{ isLL1?'': '不' }}是LL1文法
        </div>
        <FormatTips v-if="showHandleVisible" :needHandle="needHandle" @saveGrammar="saveGrammar" />
    </div>
</template>

<script setup>
import FormatTips from '@/components/FormatTip.vue';
import { computed, onMounted, ref } from 'vue';
import lucy from "lucy-compiler";
import { ArrowLeft } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';

const store = useStore();

const isLL1 = ref(true);
const needHandle = ref([]);

const showHandleVisible = ref(false);

const showInitail = computed(() => {
    return store.getters["grammarStore/getShowInitail"];
})

const isCustomMode = computed(() => {
    return store.getters["grammarStore/getCustomMode"];
});

const grammars = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const judgeLL1 = () => {
    const ll1Parser = store.getters["grammarStore/getLL1Parser"];
    const firstSet = store.getters["grammarStore/getFirstSet"];
    const followSet = store.getters["grammarStore/getFollowSet"];
    const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
    if (!predictTable.length) {
        return;
    }
    let isLL1Grammar = true;
    try {
        predictTable.forEach((item) => {
            const { terminal2Derivation = {} } = item;
            terminal2Derivation.forEach((value) => {
                const { derivations = [] } = value;
                if (derivations.length > 1) {
                    isLL1Grammar = false;
                    throw new Error('End');
                }
            })
        })
    } catch (e) {
        if (e.message !== 'End') throw e;
    }
    isLL1.value = isLL1Grammar;
    if (!isCustomMode.value) {
        needHandle.value = [];
        lucy.checkNeedunionGrammers(grammars.value) && needHandle.value.push('needUnion');
        lucy.checkNeedliftUpCommonTocken(grammars.value) && needHandle.value.push('needLiftUp');
        lucy.checkNeedClearRightRecursion(grammars.value) && needHandle.value.push('needClearRecursion');
        if (needHandle.value.length > 0) {
            showHandleVisible.value = true;
            return;
        }
    }
    showHandleVisible.value = false;
}

const saveGrammar = (garmmar) => {
    if (isCustomMode.value) return;
    try {
        const { nonTerminals, terminals } = lucy.getTockFromSimpleGrammers(garmmar);
        store.commit("grammarStore/updateNonTerminal", nonTerminals);
        store.commit("grammarStore/updateTerminal", terminals);
        store.commit("grammarStore/updateInitialGrammar", grammars.value);
        store.commit("grammarStore/updateGrammar", garmmar);
        const ll1Parser = new lucy.LL1Parser(terminals, nonTerminals, garmmar);
        const firstSet = ll1Parser.getFirstSet();
        const followSet = ll1Parser.getFollowSet(firstSet);
        store.commit("grammarStore/updateLL1Parser", ll1Parser);
        store.commit("grammarStore/updateFirstSet", firstSet);
        store.commit("grammarStore/updateFollowSet", followSet);
    } catch (error) {
        ElMessage({
            message: '操作失败',
            type: 'error',
        });
        return;
    }
    judgeLL1();
}


onMounted(() => {
    judgeLL1();
})

</script>

<style scoped lang="less">
.judge {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .conclusion {
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 10px;

        i,
        svg {
            width: 20px;
            height: 20px;
            color: red;
        }
    }
}
</style>