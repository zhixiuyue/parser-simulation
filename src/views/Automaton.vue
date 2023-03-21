<template>
    <div class="dfa-container">
        <el-page-header :icon="ArrowLeft" title="返回" @back="goBack">
            <template #content>
                <span class="title">LR(0)自动机构造</span>
            </template>
        </el-page-header>
        <div>aaa</div>
    </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const goBack = () => {
    router.push('/');
}
</script>

<style scoped lang="less">
.dfa-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;

    .title {
        font-weight: 600;
        font-size: 14px;
    }
}
</style>