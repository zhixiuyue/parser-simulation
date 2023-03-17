<template>
    <div class="right-contant">
        <div v-if="type === 'examples'">
            <div class="support-grammers">
                <span class="support-grammers-title">支持的输入格式</span>
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

<script>

export default {
    name: 'RightTips',
    props: {
        type: String,
        data: String,
    },
    // data() {
    //     return {
    //         step: 0,
    //     }
    // },
    methods: {
    },
    created() {
        this.GRAMMERS = [
            "A => A c | A a d | b d | ϵ",
            `A => A c
            | A a d
            | b d
            | ϵ`,
            `S => A a | b
            A => A c | S d | ϵ`,
            "(Copy ϵ to input if needed)",
            "(All tokens must be separated by space characters)"
        ];
        this.EXAMPLES = [
            "S => S S + | S S * | a",
            "S => 0 S 1 | 0 1",
            "S => + S S | * S S | a",
            "S => S ( S ) S | ϵ",
            "S => S + S | S S | ( S ) | S * | a",
            "S => ( L ) | a L => L , S | S",
            "S => a S b S | b S a S | ϵ",
            `bexpr => bexpr or bterm | bterm
            bterm => bterm and bfactor 
            | bfactor
            bfactor => not bfactor | ( bexpr ) 
            | true | false`
        ]
    }
}
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
