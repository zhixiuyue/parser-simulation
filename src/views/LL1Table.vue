<template>
    <div class="table-container">
        <div class="table">
            <el-table :data="tableData" style="width: 100%; background:none" height="100%" border>
                <el-table-column fixed prop="date" label="" width="150">
                </el-table-column>
                <el-table-column prop="a" :label="a">
                </el-table-column>
                <el-table-column prop="b" label="b">
                </el-table-column>
                <el-table-column prop="c" label="c">
                </el-table-column>
                <el-table-column prop="d" label="d">
                </el-table-column>
                <el-table-column prop="e" label="#">
                </el-table-column>
            </el-table>
        </div>
        <div>
            <span>计算规则</span>
            <ul class="compute-rules">
                <li v-for="item in TABLERULES" :key="item">{{ item }}</li>
            </ul>
        </div>
    </div>
</template>

<script setup>

// export default {
//     name: 'LL1Table',
//     data() {
//         return {
//             a: '1',
//             tableData: [
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 },
//                 {
//                     date: 'A',
//                     a: 1,
//                     b: 2,
//                     c: 3,
//                     d: 4,
//                     e: 5,
//                 }
//             ]
//         }
//     },
//     created() {
//         this.TABLERULES = [
//             "若X ∈ VT，则FIRST(X) = {X}；【终结符自己就是自己的FIRST集合】",
//             "若X ∈ VN，且有产生式X -> a……， a ∈ VT，则a ∈ FIRST(X)；【非终结符，选第一个终结符加入】",
//             "若X ∈ VN，X -> ε，则 ε ∈ FIRST(X)；【能直接推出ε，ε加入FIRST】",
//             "若X,Y1,Y2,……,Yn ∈ VN，而有产生式X -> Y1,Y2,……,Yn。当Y1,Y2,……,Y(i-1)直接推出ε时，则FIRST(Y1) - ε, FIRST(Y2) - ε, …… , FIRST(Y(i-1) - ε) ,FIRST(Yi) 都包含在FIRST(X)中；【位于中间的ε是不可加入进去】",
//             "当（4）中所有Yi 都推出 ε时，则最后的FIRST(X) = FIRST(Y1) ∪ FIRST(Y2) ∪ …… ∪ FIRST(Yn) ∪ {ε}；"
//         ];
//     }
// }
</script>

<style scoped lang="less">
.table-container {
    display: flex;
    height: 91%;
    justify-content: space-between;
    flex-direction: column;
    gap: 10px;

    .table {
        flex: 1;
        height: 0;
        overflow: auto;
    }

    .compute-rules {
        font-size: 14px;
        line-height: 1.5;
    }
}
</style>