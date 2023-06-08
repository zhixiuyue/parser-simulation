<template>
  <div class="analysis">
    <LL1Table />
    <div class="container">
      <div class="content">
        <div class="input-string">
          <div class="first">
            LL(1)预测分析
            <span class="parser-string">{{ parserString }}</span>
            <el-tooltip class="box-item" effect="dark" :content="play ? '退出播放' : '播放'" placement="top">
              <el-icon @click="hanlePlay">
                <VideoPlay v-if="!play" />
                <CircleClose v-else />
              </el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-table :data="displayData" stripe style="width: 100%" border class="table">
          <el-table-column prop="Step" label="Step" align="center" />
          <el-table-column prop="Stack" label="Stack" align="center" />
          <el-table-column prop="Input" label="Input" align="center" />
          <el-table-column prop="Action" label="Action" align="center" />
        </el-table>
      </div>
      <div class="ast">
        <h4>抽象语法树</h4>
        <div id="astNodeContainer"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import LL1Table from "@/views/LL1Table.vue";
import {
  ref,
  computed,
  watch,
  onUnmounted,
  nextTick,
} from "vue";
import { useStore } from "vuex";
import Tree from "@widgetjs/tree";

const store = useStore();

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getStartTNonTer"];
});

const parserString = computed(() => {
  return store.getters["grammarStore/getLL1ParserString"];
});

const ll1Parser = computed(() => {
  return store.getters["grammarStore/getLL1Parser"];
});

const predictTable = computed(() => {
  const firstSet = store.getters["grammarStore/getFirstSet"];
  const followSet = store.getters["grammarStore/getFollowSet"];
  const predictTable = ll1Parser.value.getPredictTable(firstSet, followSet);
  return predictTable;
});

const parserData = ref([]);

const displayData = ref([]);

const genAst = (data) => {
  const tree = new Tree("#astNodeContainer", {
    data: [data],
  });
};

const generateResult = () => {
  if (!parserString.value || !nonTerminal.value) {
    return [];
  }
  let predictResult;
  try {
    predictResult = ll1Parser.value.getPredictProcess(
      parserString.value,
      nonTerminal.value,
      predictTable.value
    );
    nextTick(() => {
      genAst(predictResult.astNode);
    });
  } catch (error) {
    console.error(error);
  }
  const data = predictResult.map((value, index) => {
    return {
      Step: index + 1,
      Stack: value.parseStack?.slice()?.reverse()?.join(""),
      Input: value.remainingInput + "$",
      Action: value.parseAction,
    };
  });
  parserData.value = data;
  displayData.value = data;
};

const play = ref(false);

const hanlePlay = () => {
  play.value = !play.value;
};

const interval = ref();

const analysisPlay = () => {
  if (!parserString.value || !nonTerminal.value || !predictTable.value) {
    return [];
  }
  const gen = ll1Parser.value.getPredictProcessProgressive(
    parserString.value,
    nonTerminal.value,
    predictTable.value
  );
  genAst(gen.next().value.astNode);
  interval.value = setInterval(() => {
    const val = gen.next();
    if (val.done) {
      play.value = false;
    } else {
      if (val.value.length) {
        displayData.value = val.value.map((value, index) => {
          return {
            Step: index + 1,
            Stack: value.parseStack?.slice()?.reverse()?.join(""),
            Input: value.remainingInput + "$",
            Action: value.parseAction,
          };
        });
        nextTick(() => {
          genAst(val.value.astNode);
        });
      }
    }
  }, 2000);
};

watch(
  () => play,
  (newValue) => {
    clearInterval(interval.value);
    if (newValue.value) {
      displayData.value = [];
      analysisPlay();
    } else {
      displayData.value = parserData.value;
    }
  },
  {
    deep: true,
  }
);

onUnmounted(() => {
  clearInterval(interval.value);
});

watch(
  [() => parserString.value, nonTerminal],
  ([string, nonTer], [preString, preNonTer]) => {
    if (string && nonTer) {
      generateResult();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
</script>

<style scoped lang="less">
.analysis {
  .container {
    display: flex;
    gap: 50px;
  }

  .ast {
    flex: 0 0 fit-content;
  }

  .content {
    width: 700px;
    padding: 10px 0;

    :deep(.cell) {
      color: #000;
    }

    .input-string {
      display: flex;
      gap: 20px;
      align-items: center;

      svg {
        cursor: pointer;

        &:hover {
          color: #409eff;
        }
      }

      .first {
        font-weight: 600;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 20px;

        .parser-string {
          color: red;
          font-weight: 400;
        }
      }
    }

    div+div {
      margin-top: 10px;
    }

    .table {
      margin-top: 20px;
    }
  }
}

:deep(.treejs .treejs-checkbox) {
  display: none;
}
</style>