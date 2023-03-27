<template>
    <div>
        <el-page-header :icon="ArrowLeft" :title=title @back="goBack">
            <template #content>
                <span class="title">{{ routeType[props.step]?.text }}</span>
            </template>
            <template #extra v-if="routeType[props.step + 1]">
                <div class="next" @click="goForward">
                    <span>{{ routeType[props.step + 1]?.text }}</span>
                    <el-icon class="icon">
                        <ArrowRight />
                    </el-icon>
                </div>
            </template>
        </el-page-header>
        <div class="hr"></div>
    </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { LLRoute, LRRoute } from '@/dataList.js';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const props = defineProps({
    step: {
        type: Number,
    },
    type: {
        type: String,
    }
})

const routeType = computed(() => {
    return props.type === 'LL1' ? LLRoute : LRRoute;
})

const title = computed(() => {
    return routeType.value[props.step - 1]?.text;
})

const router = useRouter();
const goBack = () => {
    router.push(routeType.value[props.step - 1].route);
}

const goForward = () => {
    router.push(routeType.value[props.step + 1].route);
}
</script>

<style scoped lang="less">
.title {
    font-weight: 600;
    font-size: 14px;
}

:global(.el-page-header__back:hover) {
    color: #409eff;
}

.next {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:hover {
        color: #409eff;
    }

    span {
        font-size: 14px;
    }
}

.hr {
    width: 100%;
    height: 0;
    border-bottom: 1px solid #ddd;
    margin: 10px 0 5px;
}
</style>