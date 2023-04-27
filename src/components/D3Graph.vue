<template>
    <div id="graph" :class="path !== 'Automaton' ? 'fix-height' : ''"></div>
</template>

<script setup>
import { computed, ref } from 'vue';
import * as d3 from "d3"
import "@hpcc-js/wasm"
import "d3-graphviz";
import { useRouter } from 'vue-router';
const router = useRouter();

const path = computed(() => {
    return router.currentRoute.value.path.split('/')[2];
})

const props = defineProps({
    graph: {
        type: Array,
        required: true,
    },
    dotIndex: {
        type: Number,
        required: true,
    },
    defaultDirection: {
        type: Boolean,
        default: false
    }
})

const dotIndexForGraph = ref(props.dotIndex || 1);
const graphviz = ref();


//  for(let tmp of IRParser.generateStateProgressive(grammers,"E",nonTerminals,terminals)) {
// render IRParser.stateGraph

const render = (selectedItem, graphs) => {
    const graph = graphs?.length ? graphs : props.graph;
    if (graph.length) {
        function renderData(type) {
            const arr = type === 2 ? graph : graph.slice(0, dotIndexForGraph.value);
            const disGraph = `digraph  { graph [rankdir = ${props.defaultDirection ? "TB" : "LR"} splines = ortho bgcolor = "#FFFFFF"] node [ shape="box" style="rounded,filled" 
                 fontsize = 14 margin=0.2 ]
                ${arr.join('')} }`;
            graphviz.value?.renderDot(disGraph)
                .on("end", function () {
                    if (type !== 0) {
                        return;
                    }
                    dotIndexForGraph.value = dotIndexForGraph.value + 1;
                    if (dotIndexForGraph.value <= graph.length) {
                        render(selectedItem);
                    }
                });
        }
        graphviz.value = d3.select("#graph")?.graphviz().width("100%").height("100%").transition(function () {
            return d3.transition("main")
                .ease(d3.easeLinear)
                // .delay(500)
                .duration(1500);
        }).on("initEnd", renderData(selectedItem));
    }
}

const setDotIndexForGraph = (value) => {
    dotIndexForGraph.value = value;
}

defineExpose({
    render,
    setDotIndexForGraph,
});
</script>

<style scoped lang="less">
#graph {
    width: 100%;
    height: 89%;
    margin-top: 20px;
}

.fix-height {
    height: 350px !important;
}
</style>