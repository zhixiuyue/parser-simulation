<template>
    <div>
        <div class="header">
            <span @click="goBack" class="back">
                <el-icon class="icon">
                    <ArrowLeft />
                </el-icon>
                <el-dropdown v-if="(props.step === 2 || props.step === 3) && props.type === 'LR0'"
                    @command="handleCommandBack">
                    <span class="el-dropdown-link">
                        {{ selectItemsBack[selectedItemBack] }}
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, index) in selectItemsBack" :key="item" :command="index"
                                :disabled="selectedItemBack === index">{{
                                    item
                                }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span v-else>
                    {{ title }}
                </span>
            </span>
            <span class="title">{{ routeType[props.step]?.text }}</span>
            <div class="next" @click="goForward">
                <el-dropdown v-if="props.step === 1 && props.type === 'LR0'" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ selectItems[selectedItem] }}
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item v-for="(item, index) in selectItems" :key="item" :command="index"
                                :disabled="selectedItem === index">{{
                                    item
                                }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                <span v-else>{{ routeType[props.step + 1]?.text }}</span>
                <el-icon class="icon" v-if="routeType[props.step + 1]?.text">
                    <ArrowRight />
                </el-icon>
            </div>
        </div>
        <div class="hr"></div>
    </div>
</template>

<script setup>
import { ArrowLeft } from '@element-plus/icons-vue';
import { LLRoute, LRRoute } from '@/dataList.js';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

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

const selectItems = [routeType.value[props.step + 1]?.text, routeType.value[props.step + 2]?.text];
const selectedItem = ref(Number(localStorage.getItem('nextRouteForAutomaton')) ?? 0);

const handleCommand = (command) => {
    selectedItem.value = command;
    localStorage.setItem('nextRouteForAutomaton', command);
}

const selectItemsBack = [routeType.value[props.step - 1]?.text, routeType.value[props.step - 2]?.text];
const selectedItemBack = ref((props.step === 2 ? Number(localStorage.getItem('backRouteForLRTable')) : Number(localStorage.getItem('nextRouteForLRAnalysis'))) ?? 0);

const handleCommandBack = (command) => {
    selectedItemBack.value = command;
    if (props.step === 2) {
        localStorage.setItem('backRouteForLRTable', command);
    } else if (props.step === 3) {
        localStorage.setItem('nextRouteForLRAnalysis', command);
    }
}

const router = useRouter();
const goBack = () => {
    router.push(routeType.value[props.step - 1 - ((props.step === 2 || props.step === 3) && props.type === 'LR0' ? selectedItemBack.value : 0)].route);
}

const goForward = () => {
    router.push(routeType.value[props.step + 1 + (props.step === 1 && props.type === 'LR0' ? selectedItem.value : 0)].route);
}
</script>

<style scoped lang="less">
.header {
    display: flex;
    justify-content: space-between;

    .back,
    .next {
        display: flex;
        align-items: center;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }

        span {
            font-size: 14px;
            margin-left: 5px;

            &:hover {
                color: #409eff;
            }

        }
    }

    .title {
        font-weight: 600;
        font-size: 14px;
    }

    .next {
        span {
            margin-left: 0;
            margin-right: 5px;
        }
    }
}

// :global(.el-page-header__back:hover) {
//     color: #409eff;
// }

.hr {
    width: 100%;
    height: 0;
    border-bottom: 1px solid #ddd;
    margin: 10px 0 5px;
}
</style>