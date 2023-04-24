<template>
  <div class="table" @click="showData">
    <!-- <CustomHeader :step=2 type="LL1" /> -->
    <div class="first" v-if="!getHideFirset">First Set & Follow Set
      <el-tooltip class="box-item" effect="dark" :content="hideSet ? '显示' : '隐藏'" placement="top">
        <el-icon @click="handleSetDisplay">
          <View v-if="hideSet" />
          <Hide v-else />
        </el-icon>
      </el-tooltip>
    </div>
    <el-table :data="fistData" style="width: 100%" border v-show="!hideSet && !getHideFirset"
      :cell-class-name="setClassName">
      <el-table-column prop="nonTerminal" label="" align="center" width="150" />
      <el-table-column prop="FIRST" label="FIRST" align="center" />
      <el-table-column prop="FOLLOW" label="FOLLOW" align="center" />
    </el-table>
    <div class="first">LL(1)分析表
      <el-tooltip class="box-item" effect="dark" :content="play ? '退出播放' : '播放'" placement="top">
        <el-icon @click="hanlePlay">
          <VideoPlay v-if="!play" />
          <CircleClose v-else />
        </el-icon>
      </el-tooltip>
    </div>
    <div v-if="rules.length" class="rules-container">
      <span class="rules-title">规则:</span>
      <ul class="rules">
        <li v-for=" (item, index) in rules" :key="item" :class="{ 'high': selectedRuleIndex === index }">
          {{ item }}
        </li>
      </ul>
    </div>
    <el-table :data="tableData" max-height="600" border class="table-data" :cell-class-name="cellClassName">
      <el-table-column fixed prop="nonTerminal" label="" width="150" align="center">
      </el-table-column>
      <el-table-column v-for="item in terminal" :key="item" :prop="item" :label="item" align="center">
        <template #default="scope">
          <ul>
            <li v-for=" item in scope.row[scope.column.rawColumnKey]" :key="item">
              {{ item }}
            </li>
          </ul>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
// import CustomHeader from '@/components/Header.vue';
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { ArrowLeft } from '@element-plus/icons-vue';
import { useStore } from 'vuex';
import _ from 'lodash';

const store = useStore();

const hideSet = ref(false);

const handleSetDisplay = () => {
  hideSet.value = !hideSet.value;
};

const getHideFirset = computed(() => {
  return store.getters["grammarStore/getHideFirset"];
});

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getNonTerminal"];
});

const terminal = computed(() => {
  return [...store.getters["grammarStore/getTerminal"], "$"];
});

const firstSet = computed(() => {
  return store.getters["grammarStore/getFirstSet"];
});

const followSet = computed(() => {
  return store.getters["grammarStore/getFollowSet"];
});

const tableData = ref([]);

const ll1Parser = computed(() => {
  return store.getters["grammarStore/getLL1Parser"];
});

const transferData = (table) => {
  return table?.map((item) => {
    const { nonTerminal = '', terminal2Derivation = {} } = item;
    const resMap = new Map();
    terminal2Derivation.forEach((value, key) => {
      const { derivations = [], nonTerminal = '' } = value;
      const newStrArr = derivations.map((val) => {
        if (!val.length) return '';
        return `${nonTerminal} => ${val.join(' ')}`;
      })
      resMap.set(key, newStrArr);
    })
    return {
      nonTerminal,
      ...Object.fromEntries(resMap.entries()),
    }
  })
}

const genTableData = () => {
  const predictTable = ll1Parser.value.getPredictTable(firstSet.value, followSet.value);
  if (!predictTable.length) {
    return [];
  }
  tableData.value = transferData(predictTable);
}

onMounted(() => {
  genTableData();
})

const rules = ref([]);

const interval = ref();

const judgeArrEqual = (a, b) => {
  if (a?.length === b?.length && a.filter(t => !b.includes(t))) {
    return true;
  }
  return false;
}

const diffArray = ref([]);
let selectedSet = ref({});
const selectedRuleIndex = ref();

const showArrayDiff = (a, b) => {
  const diffArr = [];
  for (let i = 0; i < a.length; i++) {
    for (let val in a[i]) {
      if ((Array.isArray(a[i][val]) && !judgeArrEqual(a[i][val], b[i][val])) || ((!Array.isArray(a[i][val]) && a[i][val] !== b[i][val]))) {
        diffArr.push({
          [val]: a[i].nonTerminal,
        });
      }
    }
  }
  return diffArr;
}

const play = ref(false);

const hanlePlay = () => {
  play.value = !play.value;
}

const tablePlay = () => {
  clearInterval(interval.value);
  const genetator = ll1Parser.value.getPredictTableProgressive(firstSet.value, followSet.value);
  rules.value = genetator.next().value;
  // tableData.value = transferData(genetator.next().value?.result);
  const func = () => {
    const data = genetator.next();
    selectedRuleIndex.value = data.value?.ruleIndex;
    if (data.done) {
      clearInterval(interval.value);
      diffArray.value = [];
      selectedSet.value = {};
      play.value = false;
    } else {
      diffArray.value = showArrayDiff(transferData(data.value?.result), tableData.value);
      if (diffArray.value[0]) {
        selectedSet.value = {
          [data.value?.ruleIndex === 0 ? 'FIRST' : 'FOLLOW']: Object.values(diffArray.value[0])[0]
        }
      }
      tableData.value = transferData(data.value?.result);
    }
  };
  func();
  interval.value = setInterval(func, 2500);
}

onUnmounted(() => {
  clearInterval(interval.value);
})

const fistData = computed(() => {
  const firstSetMap = firstSet.value.reduce((acc, curr) => {
    acc[curr.tocken] = `{ ${[...curr.terminals.values()].join(" , ")} }`;
    return acc;
  }, {});
  const followSetMap = followSet.value.reduce((acc, curr) => {
    acc[curr.tocken] = `{ ${[...curr.terminals.values()].join(" , ")} }`;
    return acc;
  }, {});

  const arr = nonTerminal.value.map((val) => {
    return {
      nonTerminal: val,
      FIRST: firstSetMap[val],
      FOLLOW: followSetMap[val],
    };
  });
  return arr;
});

const cellClassName = ({ row, column }) => {
  for (let i = 0; i < diffArray.value.length; i++) {
    if (column.rawColumnKey === Object.keys(diffArray.value[i])[0] && row.nonTerminal === Object.values(diffArray.value[i])[0]) {
      return 'highlight';
    }
  }
  return '';
}

const setClassName = ({ row, column }) => {
  if (column.label === Object.keys(selectedSet.value)[0] && row.nonTerminal === Object.values(selectedSet.value)[0]) {
    return 'highlight';
  }
  return '';
}

watch(() => play, (newValue) => {
  if (newValue.value) {
    tablePlay();
  } else {
    clearInterval(interval.value);
    diffArray.value = [];
    selectedSet.value = {};
    rules.value = [];
    genTableData();
  };
}, {
  deep: true
})

</script>

<style scoped lang="less">
.table {
  display: flex;
  flex-direction: column;
  gap: 10px;

  /deep/ .highlight {
    background-color: #ecf5ff;
  }

  .high {
    background-color: #ecf5ff;
  }

  .table-data {
    background: none;
    // width: 100%;

    td {
      font-weight: 600;
    }

    ul {
      padding: 0;
    }

    li {
      list-style-type: none;
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

  .rules-container {
    margin-top: 10px;
    display: flex;
    gap: 10px;

    .rules-title {
      flex: 0 0 50px;
      margin-top: 21px;
    }
  }

  .rules {
    list-style: none;
    padding: 0;

    li {
      padding: 5px 10px;
    }
  }

  svg {
    cursor: pointer;
  }
}
</style>