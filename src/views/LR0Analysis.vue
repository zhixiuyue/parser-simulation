<template>
  <div class="analysis">
    <LR0Table />
    <div class="content-container">
      <div class="content" ref="analysisRef">
        <div class="input-string">
          <div class="first">
            {{ type }}预测分析
            <span class="parser-string">{{ parserString }}</span>
          </div>
        </div>
        <div v-if="!parserData.length">字符串规约失败</div>
        <el-table v-else :data="parserData" stripe style="max-width: 700px" border class="table">
          <el-table-column prop="Step" label="Step" header-align="center" />
          <el-table-column prop="Stack" label="Stack" header-align="center" />
          <el-table-column prop="Symbols" label="symbols" header-align="center" />
          <el-table-column prop="Input" label="Input" align="right" header-align="center" />
          <el-table-column prop="Action" label="Action" header-align="center" />
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
import LR0Table from "@/views/LR0Table.vue";
import { ref, computed, watch, reactive, nextTick } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useStore } from "vuex";
import Tree from "@widgetjs/tree";

const store = useStore();
const type = computed(() => {
  return store.getters["grammarStore/getLR0Type"];
});

const parserData = ref([]);

const analysisRef = ref(null);

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getStartTNonTer"];
});

const genAst = (data) => {
  console.log(data);
  const tree = new Tree("#astNodeContainer", {
    data,
  });
};

const parserString = computed(() => {
  return store.getters["grammarStore/getLRParsingString"];
});

const predictTable = computed(() => {
  return store.getters["grammarStore/getLRPredictTable"];
});

const genParserData = () => {
  if (!parserString.value || !nonTerminal.value) {
    return [];
  }
  const lRParser = store.getters["grammarStore/getLRParser"];
  let predictResult = [];
  try {
    predictResult = lRParser.predictInputWithAST(
      parserString.value,
      predictTable.value
    );
    nextTick(() => {
      genAst(predictResult[predictResult.length - 1].symbols);
    });
  } catch (error) {
    console.error(error);
  }
  const data = predictResult.map((value, index) => {
    return {
      Step: index + 1,
      Stack: value.stack.join(" "),
      Symbols: value.symbols.map(node => node.text).join(" "),
      Input: value.input.join(" "),
      Action: value.move,
    };
  });
  parserData.value = data;
};

watch(
  [() => parserString.value, predictTable],
  ([string, nonTer], [preString, preNonTer]) => {
    if (string && nonTer) {
      genParserData();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  () => parserData,
  (newValue) => {
    nextTick(() => {
      analysisRef.value?.scrollIntoView({ behavior: "smooth" });
    });
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less">
.content-container {
  display: flex;
  gap: 50px;

  .ast {
    flex: 0 0 fit-content;
  }
}

.analysis {
  :deep(.cell) {
    color: #000;
  }

  .content {
    padding: 10px 0;

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

        .parser-string {
          margin-left: 20px;
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

    .table-data {
      margin-top: 20px;
      background: none;
      width: 100%;

      ul {
        padding: 0;
      }

      li {
        list-style-type: none;
      }
    }
  }
}

:deep(.treejs .treejs-checkbox) {
  display: none;
}
</style>