<template>
    <div class="right-contant">
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
        <div v-if="type === 'grammer'">
            <span class="support-grammers-title">文法</span>
            <ul class="support-grammers-list">
                <li v-for="item in $store.getters.getGrammer" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue";

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

</script>

<style scoped lang="less">
.right-contant {
    height: 100%;
    width: 100%;
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
}
</style>
