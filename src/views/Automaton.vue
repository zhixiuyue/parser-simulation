<template>
  <div class="analysis">
    <div class="argument">
      <div class="first">
        {{ type }}自动机
        <el-tooltip class="box-item" effect="dark" :content="hideDfa ? '显示' : '隐藏'" placement="top">
          <el-icon @click="handleDfaDisplay">
            <View v-if="hideDfa" />
            <Hide v-else />
          </el-icon>
        </el-tooltip>
        <div class="control-btn" v-show="selectedItem === 1 && !hideDfa">
          <el-button :icon="ArrowLeft" @click="goBack" :disabled="dotIndex <= 1">上一步</el-button>
          <el-button @click="goForward" :disabled="dotIndex >= graph.length">
            下一步<el-icon class="el-icon--right">
              <ArrowRight />
            </el-icon>
          </el-button>
          <span class="step">{{ dotIndex }} / {{ graph.length }}</span>
        </div>
      </div>
    </div>
    <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="dotIndex" v-show="!hideDfa" />
  </div>
</template>

<script setup>
import { ArrowLeft } from "@element-plus/icons-vue";
import D3Graph from "@/components/D3Graph.vue";
import { ref, computed, reactive, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const type = computed(() => {
  switch (router.currentRoute.value.path.split("/")[1]) {
    case "LR0":
      return "LR(0)";
    case "LR1LALR":
      return "LR(1)";
    default:
      return "";
  }
});

const hideDfa = ref(false);

const D3GrapghRef = ref(null);

const handleDfaDisplay = () => {
  hideDfa.value = !hideDfa.value;
};

const startNonTerminal = computed(() => {
  return store.getters["grammarStore/getStartTNonTer"];
});

const graphArr = ref([]);
const stateValue = ref([]);
const graphSet = ref(new Set());

const generateDots = (stateNodeValue) => {
  let newArr = [];
  if (!stateNodeValue?.length) {
    return;
  }
  stateNodeValue.forEach((item) => {
    graphSet.value.add(item.id);
    if (!item?.edges?.length) {
      return;
    }
    item.edges.forEach((edgeItem) => {
      graphArr.value = [
        ...graphArr.value,
        edgeItem?.next?.id === -1
          ? `id [label="Accept" shape="none" style="none"] id${item.id} -> id [ xlabel="${edgeItem?.tocken}"]`
          : `id${edgeItem?.next?.id} [label="S${edgeItem?.next?.id
          }\n${edgeItem?.next?.items.join("\n")}" ${edgeItem?.next?.isCollision ? 'fillcolor="#fc8353"' : ""
          }] id${item.id} -> id${edgeItem?.next?.id} [ xlabel="${edgeItem?.tocken
          }"]`,
      ];
      if (edgeItem?.next && !graphSet.value.has(edgeItem.next.id)) {
        newArr.push(edgeItem.next);
      }
    });
  });
  stateValue.value = newArr;
};

const argument = computed(() => {
  return store.getters["grammarStore/getArgument"];
});

const generateData = () => {
  let parser = store.getters["grammarStore/getLRParser"];
  if (!parser) {
    parser = store.getters["grammarStore/getLR1LALRParser"];
  }
  const stateNodeValue = parser.stateGraph;
  if (!argument.value) {
    store.commit("grammarStore/updateArgument", stateNodeValue?.items[0]);
  }
  graphArr.value = [
    `id${stateNodeValue?.id} [label="S${stateNodeValue?.id
    }\n${stateNodeValue?.items.join("\n")}" ${stateNodeValue.isCollision ? 'fillcolor="#fc8353"' : ""
    }] `,
  ];
  stateValue.value = [stateNodeValue];
  while (stateValue.value.length) {
    generateDots(stateValue.value);
  }
  store.commit("grammarStore/updateGraph", graphArr.value);
};

const graph = computed(() => {
  return store.getters["grammarStore/getGraph"];
});

const dotIndex = ref(1);

const goBack = () => {
  if (dotIndex.value <= 0) return;
  dotIndex.value = dotIndex.value - 1;
  D3GrapghRef.value.setDotIndexForGraph(dotIndex.value);
  D3GrapghRef.value?.render(selectedItem.value);
};

const goForward = () => {
  if (dotIndex.value >= graph.value.length) {
    return;
  }
  dotIndex.value = dotIndex.value + 1;
  D3GrapghRef.value.setDotIndexForGraph(dotIndex.value);
  D3GrapghRef.value?.render(selectedItem.value);
};

onMounted(() => {
  if (!graph.value?.length) {
    generateData();
  } else {
    D3GrapghRef.value?.render(selectedItem.value);
  }
});

const selectedItem = computed(() => {
  return store.getters["grammarStore/getDfaPlayMethod"];
});

watch(
  () => startNonTerminal,
  (newValue, preValue) => {
    if (!newValue.value) {
      router.push("/");
    } else {
      if (preValue == undefined) {
        setTimeout(() => {
          D3GrapghRef.value?.render(selectedItem.value);
        }, 1000);
      }
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  [() => graph.value, selectedItem],
  ([graphs, item], [preGraph, preItem]) => {
    if (graphs.length && item != undefined) {
      dotIndex.value = 1;
      D3GrapghRef.value?.setDotIndexForGraph(dotIndex.value);
      D3GrapghRef.value?.render(item, graphs);
    }
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less">
.analysis {
  position: relative;
  height: 100%;

  .argument {
    display: flex;
    align-items: center;
    gap: 20px;

    .el-dropdown-link {
      cursor: pointer;
      color: var(--el-color-primary);
      display: flex;
      align-items: center;
    }
  }

  .first {
    font-weight: 600;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      cursor: pointer;
    }
  }

  .control-btn {
    margin-left: 20px;

    .step {
      margin-left: 10px;
      display: inline-flex;
      align-items: center;
    }
  }
}
</style>