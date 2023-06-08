<template>
  <div class="table-container">
    <Automaton class="dfa" />
    <div class="table" @click="test" v-if="!ignoreLRTable">
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
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import Automaton from "./Automaton.vue";

const router = useRouter();
const store = useStore();
const type = computed(() => {
  return store.getters["grammarStore/getLR1LALRType"];
});

const hideTable = ref(false);

const D3GrapghRef = ref(null);

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

const play = ref(false);

const LR1LALRPredictTable = computed(() => {
  const parser = store.getters["grammarStore/getLR1LALRParser"];
  console.log(parser);
  switch (type.value) {
    case "LR(1)":
      return parser.generateLR1PredictTable();
    case "LALR":
      return parser.generateLALRPredictTable();
  }
  return [];
});

watch(
  () => LR1LALRPredictTable,
  (newValue) => {
    store.commit("grammarStore/updateLR1LALRPredictTable", newValue.value);
  },
  {
    immediate: true,
    deep: true,
  }
);

const tableData = computed(() => {
  const predictTable = LR1LALRPredictTable.value;
  if (!predictTable.length) {
    return;
  }
  const arr = predictTable.map((item, index) => {
    const { action = {}, goto = {} } = item;
    return {
      State: item.id,
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

</script>

<style scoped lang="less">
.table-container {
  display: flex;
  flex-direction: column;
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

  .table-data {
    ul {
      padding: 0;
    }

    li {
      list-style-type: none;
    }
  }
}
</style>