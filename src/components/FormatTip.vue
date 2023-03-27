<template>
    <div class="dialog-body">
        <div class="content">检测到该文法存在{{ showText }}，是否需要进行文法改写？</div>
        <el-checkbox-group v-model="checkList" class="checkbox">
            <el-checkbox v-for="item in props.needHandle" :key="item" :label="handleItems[item].handleText"
                size="large" />
        </el-checkbox-group>
        <div class="handle">
            <el-popover placement="top" :width="250" trigger="hover">
                <ul class="support-grammers-list">
                    <li v-for="item in showPreview()" :key="item">{{ item }}</li>
                </ul>
                <template #reference>
                    <span class="preview">预览处理结果</span>
                </template>
            </el-popover>
            <div class="btn-container">
                <el-button type="primary" @click="handleGrammar">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import lucy from "lucy-compiler";
import { useStore } from 'vuex';

const store = useStore();
const emit = defineEmits(["saveGrammar"]);

const getResult = (grammar) => {
    for (let i in handleItems) {
        if (checkList.value.includes(handleItems[i].handleText)) {
            grammar = handleItems[i].handle(grammar);
        }
    }
    return grammar;
}

const grammarState = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const showPreview = () => {
    let grammar = grammarState.value;
    if (checkList.value.length) {
        grammar = getResult(grammar);
    }
    return grammar;
}

const handleGrammar = () => {
    if (checkList.value.length) {
        let grammar = grammarState.value;
        emit('saveGrammar', getResult(grammar));
    }
}

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    },
    needHandle: {
        type: Array,
        required: true,
    },
})

const handleItems = reactive({
    needUnion: {
        text: "同类项",
        handleText: "合并同类项",
        handle: (grammar) => {
            return lucy.unionGrammers(grammar);
        }
    },
    needLiftUp: {
        text: "左公因子",
        handleText: "提取左公因子",
        handle: (grammar) => {
            return lucy.liftUpCommonTocken(grammar);
        }
    },
    needClearRecursion: {
        text: "左递归",
        handleText: "消除左递归",
        handle: (grammar) => {
            return lucy.clearRightRecursion(grammar);
        }
    }
})

const showText = computed(() => {
    let str = '';
    props.needHandle.forEach((val, index) => {
        str += handleItems[val].text;
        if (index < props.needHandle.length - 1) {
            str += '/';
        }
    })
    return str;
})

const checkList = ref([]);

onMounted(() => {
    checkList.value = props.needHandle.map((value) => {
        return handleItems[value].handleText;
    });
})

</script>

<style scoped lang="less">
.content {
    font-size: 16px;
}

.checkbox {
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    &>label {
        width: fit-content;

        &>span {
            font-size: 16px;
        }
    }
}

.handle {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    width: fit-content;

    .preview {
        text-decoration: underline;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }

    .btn-container {
        button {
            width: 90px;
        }
    }

}
</style>