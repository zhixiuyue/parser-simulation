<template>
    <div class="table-container">
        <div class="table">
            <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
                <template #content>
                    <span class="title">LL(1)分析表构造</span>
                </template>
            </el-page-header>
            <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="State" label="STATE" />
                <el-table-column label="ACTION">
                    <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item">
                    </el-table-column>
                </el-table-column>
                <el-table-column label="GOTO">
                    <el-table-column v-for="item in nonTerminal" :key="item" :prop="item" :label="item">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </div>
        <RightTips type="grammar" />
    </div>
</template>

<script setup>
import RightTips from '@/components/RightTips.vue';
import { computed } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
const tableData = [
    {
        date: '2016-05-03',
        a: 'Tom',
        b: 'California',
        c: 'Los Angeles',
        d: 'No. 189, Grove St, Los Angeles',
        zip: 'CA 90036',
    }]

const router = useRouter();
const goBack = () => {
    router.push('/');
}

const store = useStore();

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const terminal = computed(() => {
    return [...store.getters["grammarStore/getTerminal"], '$'];
})
</script>

<style scoped lang="less">
.table-container {
    display: flex;
    gap: 10px;
    height: 100%;

    .table {
        flex: 1;
        padding: 20px;
        width: 0;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .title {
            font-weight: 600;
            font-size: 14px;
        }
    }

}
</style>