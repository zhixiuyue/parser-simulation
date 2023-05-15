<template>
  <div class="table-container">
    <Automaton class="dfa" />
    <div class="table" @click="test" v-if="!ignoreLRTable">
      <!-- <CustomHeader :step=2 type="LR0" /> -->
      <div class="first">
        {{ type }}分析表
        <el-tooltip class="box-item" effect="dark" :content="hideTable ? '显示' : '隐藏'" placement="top">
          <el-icon @click="handleTableDisplay">
            <View v-if="hideTable" />
            <Hide v-else />
          </el-icon>
        </el-tooltip>
      </div>
      <el-table v-show="!hideTable" :data="tableData" class="table-data" stripe style="max-width: 700px">
        <el-table-column prop="State" label="STATE" align="center" />
        <el-table-column label="ACTION" align="center">
          <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item" align="center">
            <template #default="scope">
              <ul>
                <li v-for="item in scope.row[scope.column.rawColumnKey]" :key="item">
                  {{ item }}
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="GOTO" align="center">
          <el-table-column v-for="item in nonTerminal" :key="item" :prop="item" :label="item" align="center">
            <template #default="scope">
              <ul>
                <li v-for="item in scope.row[scope.column.rawColumnKey]" :key="item">
                  {{ item }}
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <!-- <el-drawer v-model="drawer" title="LR(0)DFA" direction="rtl" size="33%">
                <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="1" :defaultDirection="true"></D3Graph>
            </el-drawer> -->
      <!-- <el-button v-show="!play" class="open-dfa" @click="openDrawer">
                查看DFA
            </el-button> -->
    </div>
    <!-- <div class="graph" v-show="play">
            <D3Graph ref="D3GrapghRef" :graph="graph" :dotIndex="1" :defaultDirection="true">
            </D3Graph>
        </div> -->
  </div>
</template>

<script setup>
// import CustomHeader from '@/components/Header.vue';
import InputString from "../components/InputString.vue";
import D3Graph from "@/components/D3Graph.vue";
import { computed, watch, ref, reactive, onMounted } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Automaton from "./Automaton.vue";

const router = useRouter();
const type = computed(() => {
  return store.getters["grammarStore/getLR0Type"];
});

const hideTable = ref(false);

const D3GrapghRef = ref(null);

const store = useStore();

const drawer = ref(false);

const handleTableDisplay = () => {
  hideTable.value = !hideTable.value;
};

const ignoreLRTable = computed(() => {
  return store.getters["grammarStore/getHideLRTable"];
});

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getNonTerminal"];
});

const terminal = computed(() => {
  return [...store.getters["grammarStore/getTerminal"], "$"];
});

const graph = computed(() => {
  return store.getters["grammarStore/getGraph"];
});

const openDrawer = () => {
  drawer.value = true;
};

const play = ref(false);

const unfold = computed(() => {
  return store.getters["grammarStore/getUnFold"];
});

const hanlePlay = () => {
  play.value = !play.value;
};

const LRPredictTable = computed(() => {
  const parser = store.getters["grammarStore/getLRParser"];
  switch (type.value) {
    case "LR(0)":
      return parser.generateLR0PredictTable();
    case "SLR(1)":
      return parser.generateSLR1PredictTable();
  }
  return [];
});

watch(
  () => LRPredictTable,
  (newValue) => {
    store.commit("grammarStore/updateLRPredictTable", newValue.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

const tableData = computed(() => {
  const predictTable = LRPredictTable.value;
  if (!predictTable.length) {
    return;
  }
  const arr = predictTable.map((item, index) => {
    const { action = {}, goto = {} } = item;
    return {
      State: index,
      ...Object.fromEntries(action.entries()),
      ...Object.fromEntries(goto.entries()),
    };
  });
  return arr;
});

const startNonTerminal = computed(() => {
  return store.getters["grammarStore/getStartTNonTer"];
});

watch(
  () => startNonTerminal,
  (newValue, preValue) => {
    if (!newValue.value) {
      router.push('/');
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => D3GrapghRef,
  (newValue, preValue) => {
    if (newValue.value) {
      D3GrapghRef.value?.render(2);
      setTimeout(() => {
        D3GrapghRef.value?.render(2);
      }, 100);
    }
  },
  {
    // immediate: true,
    deep: true,
  }
);

const foldStatus = ref(store.state.grammarStore.unfold);

watch(
  () => play,
  (newValue) => {
    if (newValue.value) {
      store.commit("grammarStore/updateUnfold", false);
    } else {
      store.commit("grammarStore/updateUnfold", foldStatus.value);
    }
  },
  {
    deep: true,
  }
);

const passData = reactive({});
</script>

<style scoped lang="less">
.table-container {
  display: flex;
  flex-direction: column;
}

// .dfa {
//     flex: 1 0 350px;
// }

.none-dfa {
  height: fit-content;
}

.graph {
  flex: 1;
  height: 100%;
}

.table {
  display: flex;
  flex-direction: column;
  gap: 10px;

  :deep(.cell) {
    color: #000;
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

  .title {
    margin: 10px 0;
  }

  .table-data {
    ul {
      padding: 0;
    }

    li {
      list-style-type: none;
    }

    // :global(.el-table .cell) {
    //     padding: 0;
    // }
  }

  .open-dfa {
    width: fit-content;
  }
}
</style>