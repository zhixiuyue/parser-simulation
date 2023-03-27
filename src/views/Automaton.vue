<template>
    <div class="dfa-container">
        <RightTips type="grammar" />
        <div class="analysis">
            <CustomHeader :step=1 type="LR0" />
            <div id="graph"></div>
        </div>
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LR0" @saveInput="saveInput" :data="passData"
            notShowInput="true" @onClose="onClose" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import CustomHeader from '@/components/Header.vue';
import InputString from '@/components/InputString.vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import lucy from "lucy-compiler";
import { ref, computed, reactive, watch, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { LRRoute } from '@/dataList.js';
import * as d3 from "d3"
import "@hpcc-js/wasm"
import "d3-graphviz";

const store = useStore();
const router = useRouter();

const passData = reactive({});
const showDialog = ref(false);

const saveInput = (string, value) => {
    store.commit("grammarStore/updateLRStartNonTerminal", value);
    showDialog.value = false;
}

const startNonTerminal = computed(() => {
    return store.getters["grammarStore/getLRStartNonTerminal"];
})

const onClose = () => {
    if (!startNonTerminal.value) {
        router.push(LRRoute[0].route);
    } else {
        showDialog.value = false;
    }
}

const graphviz = ref();

const showGraph = () => {

}

let stateNode = reactive({});

const generateData = () => {
    const lRParser = store.getters["grammarStore/getLRParser"];
    const grammar = store.getters["grammarStore/getGrammar"];
    const nonTerminals = store.getters["grammarStore/getNonTerminal"];
    const terminal = store.getters["grammarStore/getTerminal"];
    const startNonTerminal = store.getters["grammarStore/getLRStartNonTerminal"]
    lRParser.generateState(grammar, startNonTerminal, nonTerminals, terminal);
    const stateNodeValue = lRParser.stateGraph;
    console.log(stateNodeValue);
    stateNode = stateNodeValue;
}

watch(() => startNonTerminal, (newValue) => {
    if (!newValue.value) {
        showDialog.value = true;
    } else {
        generateData();
    }
}, {
    immediate: true,
    deep: true
})
</script>

<style scoped lang="less">
.dfa-container {
    display: flex;
    gap: 10px;
    height: 100%;


    .analysis {
        flex: 1;
        padding: 20px 8%;
        width: 0;
    }
}
</style>