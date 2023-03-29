<template>
    <div class="judge-container">
        <RightTips type="grammar" />
        <div class="judge">
            <CustomHeader :step=1 type="LL1" />
            <div class="rules">
                <div>
                    LL(1)文法规则
                </div>
                <div>
                    1、对于每一个产生式 A → α1|α2|…|αn, FIRST(αi) ∩ FIRST(αj) = Φ, 对于所有的 i 和 j, 有1≤i, j ≤ n, i≠j
                </div>
                <div>
                    2、对于每一个非终结符 A , 如果 FIRST(A) 包含 ε, FIRST(A) ∩ FOLLOW(A) = Φ
                </div>
            </div>
            <div class="conclusion">
                该文法{{ isLL1?'': '不' }}是LL1文法
            </div>
            <FormatTips v-if="showHandleVisible" :needHandle="needHandle" @saveGrammar="saveGrammar" />
        </div>
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import FormatTips from '@/components/FormatTip.vue';
import CustomHeader from '@/components/Header.vue';
import { computed, onMounted, ref } from 'vue';
import lucy from "lucy-compiler";
import { ArrowLeft } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import { LLRoute } from '@/dataList.js';
import { ElMessage } from 'element-plus';

const store = useStore();

const isLL1 = ref(true);
const needHandle = ref([]);

const showHandleVisible = ref(false);

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
        store.commit("grammarStore/updateGrammar", garmmar);
        const ll1Parser = new lucy.LL1Parser(terminals, nonTerminals, garmmar);
        const firstSet = ll1Parser.getFirstSet();
        const followSet = ll1Parser.getFollowSet(firstSet);
        // const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
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
.judge-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .judge {
        flex: 1;
        padding: 20px 8%;
        width: 0;
        display: flex;
        flex-direction: column;
        gap: 20px;
        overflow: auto;

        .rules {
            background-color: #fff;
            padding: 30px;
            border-radius: 5px;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .conclusion {
            font-weight: 600;
        }
    }
}
</style>