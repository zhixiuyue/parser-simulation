<template>
    <div class="set-container">
        <ul class="set-display-ul">
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
            <li>【1】First(A) = First(a)+First(ε) = {a,ε}</li>
        </ul>
        <div>
            <span>计算规则</span>
            <ul class="compute-rules">
                <li v-for="item in FIRSTSETRULES" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    name: 'FollowSet',
    created() {
        this.FIRSTSETRULES = [
            "若X ∈ VT，则FIRST(X) = {X}；【终结符自己就是自己的FIRST集合】",
            "若X ∈ VN，且有产生式X -> a……， a ∈ VT，则a ∈ FIRST(X)；【非终结符，选第一个终结符加入】",
            "若X ∈ VN，X -> ε，则 ε ∈ FIRST(X)；【能直接推出ε，ε加入FIRST】",
            "若X,Y1,Y2,……,Yn ∈ VN，而有产生式X -> Y1,Y2,……,Yn。当Y1,Y2,……,Y(i-1)直接推出ε时，则FIRST(Y1) - ε, FIRST(Y2) - ε, …… , FIRST(Y(i-1) - ε) ,FIRST(Yi) 都包含在FIRST(X)中；【位于中间的ε是不可加入进去】",
            "当（4）中所有Yi 都推出 ε时，则最后的FIRST(X) = FIRST(Y1) ∪ FIRST(Y2) ∪ …… ∪ FIRST(Yn) ∪ {ε}；"
        ];
    }
}
</script>

<style scoped lang="less">
.set-container {
    display: flex;
    height: 91%;
    justify-content: space-between;
    flex-direction: column;

    .set-display-ul {
        flex: 1;
        height: 0;
        overflow: auto;
        line-height: 1.5;
    }

    .compute-rules {
        font-size: 14px;
        line-height: 1.5;
    }
}
</style>