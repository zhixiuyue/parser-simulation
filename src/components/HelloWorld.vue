<script setup>
import { ref, onMounted, reactive } from 'vue';
import * as d3 from "d3"
import "@hpcc-js/wasm"
import "d3-graphviz";
import lucy from "lucy-compiler";
defineProps({
  msg: {
    type: String,
    required: true
  }
})
let graphviz;
onMounted(() => {
  d3.select("#graph").graphviz()
    .renderDot('digraph  {hhhh2 -> b}');
  graphviz = d3.select("#graph").graphviz().transition(function () {
    return d3.transition("main")
      .ease(d3.easeLinear)
      .delay(500)
      .duration(1500);
  })
    .logEvents(true)
    .on("initEnd", render);
})

const dots = reactive([
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728"]',
    '    b [fillcolor="#1f77b4"]',
    '    a -> b',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728"]',
    '    c [fillcolor="#2ca02c"]',
    '    b [fillcolor="#1f77b4"]',
    '    a -> b',
    '    a -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728"]',
    '    b [fillcolor="#1f77b4"]',
    '    c [fillcolor="#2ca02c"]',
    '    a -> b',
    '    a -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728", shape="box"]',
    '    b [fillcolor="#1f77b4", shape="parallelogram"]',
    '    c [fillcolor="#2ca02c", shape="pentagon"]',
    '    a -> b',
    '    a -> c',
    '    b -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="yellow", shape="star"]',
    '    b [fillcolor="yellow", shape="star"]',
    '    c [fillcolor="yellow", shape="star"]',
    '    a -> b',
    '    a -> c',
    '    b -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728", shape="triangle"]',
    '    b [fillcolor="#1f77b4", shape="diamond"]',
    '    c [fillcolor="#2ca02c", shape="trapezium"]',
    '    a -> b',
    '    a -> c',
    '    b -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728", shape="box"]',
    '    b [fillcolor="#1f77b4", shape="parallelogram"]',
    '    c [fillcolor="#2ca02c", shape="pentagon"]',
    '    a -> b',
    '    a -> c',
    '    b -> c',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    a [fillcolor="#d62728"]',
    '    b [fillcolor="#1f77b4"]',
    '    c [fillcolor="#2ca02c"]',
    '    a -> b',
    '    a -> c',
    '    c -> b',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    b [fillcolor="#1f77b4"]',
    '    c [fillcolor="#2ca02c"]',
    '    c -> b',
    '}'
  ],
  [
    'digraph  {',
    '    node [style="filled"]',
    '    b [fillcolor="#1f77b4"]',
    '}'
  ],
])

var dotIndex = 0;
function render() {
  var dotLines = dots[dotIndex];
  var dot = dotLines.join('');
  graphviz.renderDot(dot)
    .on("end", function () {
      dotIndex = (dotIndex + 1) % dots.length;
      render();
    });
}

const testCase = {
  nonTerminals: ["E'", "E", "T'", "T", "F"],
  terminals: [
    ["ε", /^ε/],
    ["int", /^(0|[1-9][0-9]*)/],
    ["+", /^\+/],
    ["*", /^\*/],
    ["(", /^\(/],
    [")", /^\)/],
  ],
  grammers: [
    "E  =>  T E'",
    "E' =>  + T E' | ε",
    "T  =>  F T'",
    "T' =>  * F T' | ε",
    "F  => ( E ) | int",
  ],
};
const ll1Parser = new lucy.LL1Parser(
  testCase.terminals,
  testCase.nonTerminals,
  testCase.grammers
);
const firstSet = ll1Parser.getFirstSet();
console.log(firstSet);
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <div id="graph"></div>
    <!-- <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3> -->
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
