<template>
  <div class="analysis">
    <!-- <CustomHeader :step=3 type="LR0" /> -->
    <LR1LALRTable />
    <div class="content" ref="analysisRef">
      <div class="input-string">
        <div class="first">
          {{ type }}预测分析
          <span class="parser-string">{{ parserString }}</span>
        </div>
      </div>
      <div v-if="!parserData.length">字符串规约失败</div>
      <el-table
        v-else
        :data="parserData"
        stripe
        style="max-width: 700px"
        border
        class="table"
      >
        <el-table-column prop="Step" label="Step" header-align="center" />
        <el-table-column prop="Stack" label="Stack" header-align="center" />
        <el-table-column prop="Symbols" label="symbols" header-align="center" />
        <el-table-column
          prop="Input"
          label="Input"
          align="right"
          header-align="center"
        />
        <el-table-column prop="Action" label="Action" header-align="center" />
      </el-table>
    </div>
  </div>
  <!-- <InputString v-if="showDialog" :dialogVisible="showDialog" type="LL1" @saveInput="saveInput" :data="passData"
        :notShowNonTer=notShowNonTer @onClose="onClose" /> -->
</template>

<script setup>
// import CustomHeader from '@/components/Header.vue';
import LR1LALRTable from "@/views/LR1LALRTable.vue";
import InputString from "../components/InputString.vue";
import { ref, computed, watch, reactive, onMounted, nextTick } from "vue";
import { ArrowLeft } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { LRRoute } from "@/dataList.js";

const router = useRouter();
const store = useStore();
const type = computed(() => {
  return store.getters["grammarStore/getLR1LALRType"];
});

const passData = reactive({});

const parserData = ref([]);

const analysisRef = ref(null);

const nonTerminal = computed(() => {
  // return store.getters["grammarStore/getLRStartNonTerminal"];
  return store.getters["grammarStore/getStartTNonTer"];
});

const notShowNonTer = ref(true);

const saveInput = (string, value) => {
  store.commit("grammarStore/updateLRParsingString", string);
  // !notShowNonTer && store.commit("grammarStore/updateLRStartNonTerminal", value);
  showDialog.value = false;
};

const parserString = computed(() => {
  return store.getters["grammarStore/getLRParsingString"];
});

const predictTable = computed(() => {
  return store.getters["grammarStore/getLR1LALRPredictTable"];
});

const genParserData = () => {
  console.log(1);
  if (!parserString.value || !nonTerminal.value) {
    return [];
  }
  console.log(2);
  const parser = store.getters["grammarStore/getLR1LALRParser"];
  let predictResult = [];
  try {
    console.log(parserString.value, predictTable.value);
    predictResult = parser.predictInput(parserString.value, predictTable.value);
  } catch (error) {
    console.error(error);
  }
  console.log(predictResult);
  const data = predictResult.map((value, index) => {
    return {
      Step: index + 1,
      Stack: value.stack.join(" "),
      Symbols: value.symbols.join(" "),
      Input: value.input.join(" "),
      Action: value.move,
    };
  });
  parserData.value = data;
};

const showDialog = ref(false);

const onClose = () => {
  if (!parserString.value || !nonTerminal.value) {
    router.push(LRRoute[2].route);
  } else {
    showDialog.value = false;
  }
};

const modifyInput = () => {
  notShowNonTer.value = false;
  showDialog.value = true;
  passData["inputString"] = parserString;
  passData["value"] = nonTerminal;
};

watch(
  [() => parserString.value, predictTable],
  ([string, nonTer], [preString, preNonTer]) => {
    if (!string || !nonTer) {
    } else {
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
    // immediate: true,
    deep: true,
  }
);
</script>

<style scoped lang="less">
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

    div + div {
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
</style>