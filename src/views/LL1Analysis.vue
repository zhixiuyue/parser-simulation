<template>
  <div class="analysis">
    <!-- <CustomHeader :step="3" type="LL1" /> -->
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
          <!-- <el-icon class="icon" @click="modifyInput">
          <Edit />
        </el-icon> -->
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
  <!-- <InputString v-if="showDialog" :dialogVisible="showDialog" type="LL1" @saveInput="saveInput" :data="passData"
    @onClose="onClose" /> -->
</template>

<script setup>
// import CustomHeader from "@/components/Header.vue";
import InputString from "@/components/InputString.vue";
import LL1Table from "@/views/LL1Table.vue";
import { ref, computed, watch, reactive, onMounted, onUnmounted, nextTick } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LLRoute } from "@/dataList.js";
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

const parserData = ref([]);

const displayData = ref([]);

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
      console.log("ast", predictResult.astNode);
      const tree = new Tree("#astNodeContainer", {
        data: [predictResult.astNode],
      });
    });
  } catch (error) {
    // predictResult = [...error.value, {
    //   parseStack: error.value[error.value.length - 1].parseStack?.slice(0, -1),
    //   remainingInput: error.value[error.value.length - 1].remainingInput?.slice(1),
    //   parseAction: "match failed"
    // }];
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
}

const interval = ref();

const analysisPlay = () => {
  if (!parserData.value.length) {
    return;
  }
  let times = 1;
  interval.value = setInterval(() => {
    displayData.value = parserData.value.slice(0, times);
    if (times === parserData.value.length) {
      clearInterval(interval.value);
      play.value = false;
    }
    times += 1;
  }, 2000);
}

watch(() => play, (newValue) => {
  if (newValue.value) {
    analysisPlay();
  } else {
    clearInterval(interval.value);
    displayData.value = parserData.value;
  };
}, {
  deep: true
})

onUnmounted(() => {
  clearInterval(interval.value);
})

const showDialog = ref(false);

const onClose = () => {
  if (!parserString.value || !nonTerminal.value) {
    router.push(LLRoute[2].route);
  } else {
    showDialog.value = false;
  }
};

// const modifyInput = () => {
//   showDialog.value = true;
//   passData["inputString"] = parserString;
//   passData["value"] = nonTerminal;
// };

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
.analysis {

  .container {
    display: flex;
    gap: 50px;
  }

  .ast {
    flex: 0 0 fit-content;
  }

  .content {
    // flex: 1;
    // width: 0;
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
          // margin-left: 20px;
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

/deep/.treejs .treejs-checkbox {
  display: none;
}
</style>