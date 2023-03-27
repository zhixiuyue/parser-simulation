<template>
    <div class="right-contant-container">
        <div class="fold-btn" @click="toggleFold">
            <el-icon :size="20">
                <DArrowLeft v-if="unfold" />
                <DArrowRight v-else />
            </el-icon>
        </div>
        <div class="right-contant" v-if="unfold">
            <div v-if="type === 'examples'" class="examples">
                <div class="mode">{{ mode[props.mode].text }}</div>
                <div class="statement">
                    {{ mode[props.mode].statement }}
                </div>
                <div class="support-grammers">
                    <span class="support-grammers-title">支持的文法输入格式</span>
                    <ul class="support-grammers-list">
                        <li v-for="item in mode[props.mode].grammars" :key="item">{{ item }}</li>
                    </ul>
                </div>
                <div class="support-grammers">
                    <span class="support-grammers-title">例子</span>
                    <ul class="support-grammers-list">
                        <li v-for="item in mode[props.mode].examples" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div v-if="type === 'grammar'">
                <div class="title">
                    <span class="support-grammers-title">文法</span>
                    <el-icon class="icon" @click="goBack">
                        <Edit />
                    </el-icon>
                </div>
                <ul class="support-grammers-list">
                    <li v-for="item in grammar" :key="item">{{ item }}</li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from 'vuex';
import { mode } from '@/dataList.js';
import { useRouter } from 'vue-router';
const store = useStore();
const router = useRouter();

const unfold = ref(true);
const grammar = computed(() => {
    return store.getters["grammarStore/getGrammar"];
})

const props = defineProps({
    type: {
        type: String,
        required: true,
    },
    mode: {
        type: String,
    },
})

const toggleFold = () => {
    unfold.value = !unfold.value;
}

const goBack = () => {
    router.push({ path: '/', query: { step: 1 } })
}

</script>

<style scoped lang="less">
.right-contant-container {
    background-color: #fff;
    position: relative;
    border-right: 1px solid rgb(219, 219, 219);

    .fold-btn {
        position: absolute;
        height: 30px;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        bottom: 5px;
        right: -26px;
        cursor: pointer;
    }

    .right-contant {
        height: 100%;
        width: 280px;
        padding: 15px;
        overflow: auto;

        .examples {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .mode {
            font-size: 18px;
            font-weight: 600;
        }

        .statement {
            font-size: 14px;
            padding: 5px 10px;
        }

        .support-grammers {

            &-title {
                font-weight: 600;
            }

            &-list {
                white-space: pre-line;
                font-size: 14px;
                line-height: 1.5;
            }
        }

        .title {
            display: flex;
            align-items: center;
            gap: 10px;

            .icon {
                cursor: pointer;
            }
        }
    }
}
</style>