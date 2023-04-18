<template>
  <div class="analysis-container">
    <div class="analysis">
      <CustomHeader :step="3" type="LL1" />
      <div class="content">
        <div class="input-string">
          <span>输入串：{{ parserString }}</span>
          <!-- <span>首个非终结符：{{ nonTerminal }}</span> -->
          <el-icon class="icon" @click="modifyInput">
            <Edit />
          </el-icon>
        </div>
        <el-table :data="parserData" stripe style="width: 100%" border class="table">
          <el-table-column prop="Step" label="Step" align="center" />
          <el-table-column prop="Stack" label="Stack" align="center" />
          <el-table-column prop="Input" label="Input" align="center" />
          <el-table-column prop="Action" label="Action" align="center" />
        </el-table>
        <el-table :data="tableData" max-height="600" border class="table-data">
          <el-table-column fixed prop="nonTerminal" label="" width="150" align="center">
          </el-table-column>
          <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item" align="center">
            <template #default="scope">
              <ul>
                <li v-for="item in scope.row[scope.column.rawColumnKey]" :key="item">
                  {{ item }}
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <h3>Ast Explore</h3>
      <div id="astNodeContainer"></div>
    </div>
    <!-- <RightTips type="grammar" /> -->
    <InputString v-if="showDialog" :dialogVisible="showDialog" type="LL1" @saveInput="saveInput" :data="passData"
      @onClose="onClose" />
  </div>
</template>

<script setup>
import RightTips from "@/components/RightTips.vue";
import CustomHeader from "@/components/Header.vue";
import InputString from "../components/InputString.vue";
import { ref, computed, watch, reactive, onMounted } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LLRoute } from "@/dataList.js";
import lucy from "lucy-compiler";
import Tree from "@widgetjs/tree";

const router = useRouter();
const store = useStore();

let passData = reactive({});

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getStartTNonTer"];
  // return store.getters["grammarStore/getLL1StartNonTerminal"];
});

const saveInput = (string, value) => {
  store.commit("grammarStore/updateLL1ParserString", string);
  // store.commit("grammarStore/updateLL1StartNonTerminal", value);
  showDialog.value = false;
};

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

const terminal = computed(() => {
  return [...store.getters["grammarStore/getTerminal"], "$"];
});

const tableData = computed(() => {
  if (!predictTable.value.length) {
    return [];
  }
  const arr = predictTable.value.map((item) => {
    const { nonTerminal = "", terminal2Derivation = {} } = item;
    const resMap = new Map();
    terminal2Derivation.forEach((value, key) => {
      const { derivations = [], nonTerminal = "" } = value;
      const newStrArr = derivations.map((val) => {
        if (!val.length) return "";
        return `${nonTerminal} => ${val.join(" ")}`;
      });
      resMap.set(key, newStrArr);
    });
    return {
      nonTerminal,
      ...Object.fromEntries(resMap.entries()),
    };
  });
  return arr;
});

const parserData = ref([]);

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
    console.log("ast", predictResult.astNode);
    new Tree("#astNodeContainer", {
      data: [predictResult.astNode],
    });
  } catch (error) {
    predictResult = [...error.value, {
      parseStack: error.value[error.value.length - 1].parseStack?.slice(0, -1),
      remainingInput: error.value[error.value.length - 1].remainingInput?.slice(1),
      parseAction: "match failed"
    }];
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
};

const showDialog = ref(false);

const onClose = () => {
  if (!parserString.value || !nonTerminal.value) {
    router.push(LLRoute[2].route);
  } else {
    showDialog.value = false;
  }
};

const modifyInput = () => {
  showDialog.value = true;
  passData["inputString"] = parserString;
  passData["value"] = nonTerminal;
};

watch(
  [() => parserString.value, nonTerminal],
  ([string, nonTer], [preString, preNonTer]) => {
    if (!string || !nonTer) {
      showDialog.value = true;
    } else {
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
.analysis-container {
  display: flex;
  gap: 10px;
  height: 100%;

  .analysis {
    flex: 1;
    padding: 20px 8%;
    width: 0;
    overflow: auto;

    .content {
      padding: 10px 20px;

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

  /deep/.treejs .treejs-checkbox {
    display: none;
  }
}
</style>