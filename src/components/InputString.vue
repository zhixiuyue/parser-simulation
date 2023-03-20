<template>
    <el-dialog v-model="props.dialogVisible" title="提示" class="dialog" @close="onClose" width="500px">
        <div class="dialog-body">
            <div class="item">
                <span>请输入待分析字符串：</span>
                <el-input v-model="inputString" placeholder="请使用空格分隔每个token" clearable class="input-area" />
            </div>
            <div class="item">
                <span>请选择首个非终结符：</span>
                <el-select v-model="value" placeholder="请选择">
                    <el-option v-for="item in nonTerminal" :key="item" :label="item" :value="item" />
                </el-select>
            </div>
            <div class="btn-container">
                <el-button type="primary" class="sure-btn" @click="onFinishInput">确定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const emit = defineEmits(["saveInput", "onClose"]);

const store = useStore();
const inputString = ref(props.data?.inputString ?? '');
const value = ref(props.data?.value ?? '');

const onClose = () => {
    emit('onClose');
}

const nonTerminal = computed(() => {
    return store.getters["grammarStore/getNonTerminal"];
})

const onFinishInput = () => {
    if (!inputString.value || !value.value) {
        return;
    }
    emit('saveInput', inputString.value, value.value);
}

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    },
    type: {
        type: String,
    },
    data: {
        type: Object,
        default: {},
    }
})


</script>

<style scoped lang="less">
.dialog {

    .dialog-body {
        display: flex;
        flex-direction: column;
        gap: 15px;
        margin: 0 10px;
    }

    .item {
        display: flex;
        gap: 10px;
        align-items: center;
    }

    .input-area {
        width: 290px;
    }

    :global(.el-select) {
        width: 290px;
    }

    .btn-container {
        display: flex;
        justify-content: end;

        .sure-btn {
            width: fit-content;
            justify-content: flex-end;
        }
    }
}
</style>