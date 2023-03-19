<template>
    <div class="right-contant-container">
        <div class="fold-btn" @click="toggleFold">
            <el-icon :size="20">
                <DArrowRight v-if="unfold" />
                <DArrowLeft v-else />
            </el-icon>
        </div>
        <div class="right-contant" v-if="unfold">
            <div v-if="type === 'examples'">
                <div class="support-grammers">
                    <span class="support-grammers-title">支持的文法输入格式</span>
                    <ul class="support-grammers-list">
                        <li v-for="item in GRAMMERS" :key="item">{{ item }}</li>
                    </ul>
                </div>
                <div class="support-grammers">
                    <span class="support-grammers-title">例子</span>
                    <ul class="support-grammers-list">
                        <li v-for="item in EXAMPLES" :key="item">{{ item }}</li>
                    </ul>
                </div>
            </div>
            <div v-if="type === 'grammar'">
                <div class="title">
                    <span class="support-grammers-title">文法</span>
                    <el-icon class="icon">
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
const store = useStore();

const unfold = ref(true);
const grammar = computed(() => {
    return store.state.grammarStore.grammar;
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

const GRAMMERS_SIMPLE = [
    "A => A c | A a d | b d | ε",
    `A => A c
            | A a d
            | b d
            | ε`,
    `S => A a | b
            A => A c | S d | ε`,
    "(Copy ε to input if needed)",
    "(All tokens must be separated by space characters)"
];

const GRAMMERS_CUSTOM = [
    'bterm => bterm  bfactor | bterm  a d | b d | ϵ',
    `bterm  => bterm  bfactor
                | bterm  a d
                | b d
                | ϵ`,
    'S => bterm  a | b',
    'bterm  => bterm  bfactor | S d | ϵ',
    "(Copy ε to input if needed)",
    "(All tokens must be separated by space characters)"
];

const GRAMMERS = computed(() => {
    switch (props.mode) {
        case "simple":
            return GRAMMERS_SIMPLE;
        case 'custom':
            return GRAMMERS_CUSTOM;
        default:
            return '';
    }
})

const EXAMPLES_SIMPLE = [
    "S => S S + | S S * | a",
    "S => 0 S 1 | 0 1",
    "S => + S S | * S S | a",
    "S => S ( S ) S | ε",
    "S => S + S | S S | ( S ) | S * | a",
    "S => ( L ) | a L => L , S | S",
    "S => a S b S | b S a S | ε",
]

const EXAMPLES_CUSTOM = [
    'bexpr => bexpr or bterm | bterm',
    `bterm => bterm and bfactor
            | bfactor` ,
    `bfactor => not bfactor | ( bexpr )
            | true | false`,
]

const EXAMPLES = computed(() => {
    switch (props.mode) {
        case "simple":
            return EXAMPLES_SIMPLE;
        case 'custom':
            return EXAMPLES_CUSTOM;
        default:
            return '';
    }
})

const toggleFold = () => {
    unfold.value = !unfold.value;
}

</script>

<style scoped lang="less">
.right-contant-container {
    background-color: #fff;
    position: relative;
    border-left: 1px solid rgb(219, 219, 219);

    .fold-btn {
        position: absolute;
        height: 30px;
        width: 25px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        bottom: 5px;
        left: -26px;
        cursor: pointer;
    }

    .right-contant {
        height: 100%;
        width: 280px;
        padding: 15px;
        overflow: auto;

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
