<template>
    <div class="analysis-container">
        <div class="analysis">
            <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
                <template #content>
                    <span class="title">LL(1)分析</span>
                </template>
            </el-page-header>
            <div class="content">
                <div>输入串：{{ parserString }}</div>
                <el-table :data="parserData" stripe style="width: 100%" border>
                    <el-table-column prop="Step" label="Step" align="center" />
                    <el-table-column prop="Stack" label="Stack" align="center" />
                    <el-table-column prop="Input" label="Input" align="center" />
                    <el-table-column prop="Action" label="Action" align="center" />
                </el-table>
            </div>
        </div>
        <RightTips type="grammar" />
        <InputString v-if="showDialog" :dialogVisible="showDialog" type="LL1" @saveInput="saveInput" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import InputString from '../components/InputString.vue';
import { ref, computed, onMounted, watch } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter();
const store = useStore();
const goBack = () => {
    router.push('/');
}

const nonTerminal = ref('');

const saveInput = (string, value) => {
    store.commit("grammarStore/updateLL1ParserString", string);
    nonTerminal.value = value;
    showDialog.value = false;
}

const parserString = computed(() => {
    return store.getters["grammarStore/getLL1ParserString"];
})

const parserData = computed(() => {
    if (!parserString.value || !nonTerminal.value) {
        return [];
    }
    const ll1Parser = store.getters["grammarStore/getParser"];
    const firstSet = ll1Parser.getFirstSet();
    const followSet = ll1Parser.getFollowSet(firstSet);
    const predictTable = ll1Parser.getPredictTable(firstSet, followSet);
    const predictResult = ll1Parser.getPredictProcess(
        parserString.value,
        nonTerminal.value,
        predictTable
    );
    console.log(predictResult);
    // const data = predictResult.map((value)=>{
    //     return {

    //     }
    // })
    return [];
})

const showDialog = ref(false);

watch(() => parserString, (newValue) => {
    if (!newValue.value) {
        showDialog.value = true;
    }
}, {
    immediate: true,
    deep: true
})

</script>

<style scoped lang="less">
.analysis-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .analysis {
        flex: 1;
        padding: 20px;
        width: 0;

        .title {
            font-weight: 600;
            font-size: 14px;
        }

        .content {
            padding: 10px 20px;
        }
    }
}
</style>