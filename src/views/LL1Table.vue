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
      <span @click="handlePlayStatus(1)">计算First Set</span>
      <span @click="handlePlayStatus(2)">计算Follow Set</span>
    </div>
    <div v-if="firstRules.length && playStatus !== 0" class="rules-container">
      <span class="rules-title">规则:</span>
      <ul class="rules">
        <li v-for=" (item, index) in firstRules" :key="item" :class="{ 'high': selectedFirstRules === index }">
          {{ item }}
        </li>
      </ul>
    </div>
    <el-table :data="displayData" border v-show="!hideSet && !getHideFirset" :cell-class-name="setClassName"
      style="max-width: 700px">
      <el-table-column prop="nonTerminal" label="" align="center" width="150" />
      <el-table-column v-if="playStatus !== 2" prop="FIRST" label="FIRST" align="center" />
      <el-table-column v-if="playStatus !== 1" prop="FOLLOW" label="FOLLOW" align="center" />
    </el-table>
    <div class="first" v-show="type !== '0'">LL(1)分析表
      <el-tooltip class="box-item" effect="dark" :content="play ? '退出播放' : '播放'" placement="top">
        <el-icon @click="hanlePlay">
          <VideoPlay v-if="!play" />
          <CircleClose v-else />
        </el-icon>
      </el-tooltip>
    </div>
    <div v-if="rules.length && type !== '0'" class="rules-container">
      <span class="rules-title">规则:</span>
      <ul class="rules">
        <li v-for=" (item, index) in rules" :key="item" :class="{ 'high': selectedRuleIndex === index }">
          {{ item }}
        </li>
      </ul>
    </div>
    <el-table v-show="type !== '0'" :data="tableData" max-height="600" border class="table-data"
      :cell-class-name="cellClassName" style="max-width: 700px">
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
import { useRouter } from 'vue-router';

const store = useStore();
const router = useRouter();

const type = computed(() => {
  return router.currentRoute.value.query.type;
})

let selectedSet = ref({});

const hideSet = ref(false);

const playStatus = ref(0);

const play = ref(false);

const displayData = ref([]);

const handlePlayStatus = (params) => {
  playStatus.value = params;
}

const handleSetDisplay = () => {
  hideSet.value = !hideSet.value;
};

const firstSet = computed(() => {
  return store.getters["grammarStore/getFirstSet"];
});

const followSet = computed(() => {
  return store.getters["grammarStore/getFollowSet"];
});

const interval = ref();
const intervalFirst = ref();
const firstRules = ref([]);
const selectedFirstRules = ref();

const showFirstArrayDiff = (a, b, params) => {
  if (!a.length) {
    return [];
  }
  const diffArr = [];
  for (let i = 0; i < a.length; i++) {
    if (!b.length || a[i][params] !== b[i]?.[params]) {
      if (a[i][params]) {
        diffArr.push(
          a[i].nonTerminal
        );
      }
    }
  }
  return diffArr;
}

const playFirstData = (params) => {
  let data;
  if (params === 'FIRST') {
    data = ll1Parser.value.getFirstSetProgressive();
  } else if (params === 'FOLLOW') {
    data = ll1Parser.value.getFollowSetProgressive(firstSet.value);
  }
  if (!data) return;
  displayData.value = [];
  play.value = false;
  firstRules.value = data?.next().value;
  console.log(firstRules.value);

  const func = () => {
    const val = data.next();
    if (val.done) {
      playStatus.value = 0;
    } else {
      const firstSetMap = val.value.result?.reduce((acc, curr) => {
        acc[curr.tocken] = [...curr.terminals.values()].length ? `{ ${[...curr.terminals.values()].sort().join(" , ")} }` : '';
        return acc;
      }, {});

      const arr = Object.keys(firstSetMap).map((val) => {
        return {
          nonTerminal: val,
          [params]: firstSetMap[val],
        };
      });
      selectedSet.value = {
        [params]: showFirstArrayDiff(arr, displayData.value, params)
      }
      displayData.value = arr;
      selectedFirstRules.value = val.value?.ruleIndex;
    }
  };
  intervalFirst.value = setInterval(func, 2500);
}

const getHideFirset = computed(() => {
  return store.getters["grammarStore/getHideFirset"];
});

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getNonTerminal"];
});

const terminal = computed(() => {
  return [...store.getters["grammarStore/getTerminal"], "$"];
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
  genfirstData();
  genTableData();
})

const rules = ref([]);

const judgeArrEqual = (a, b) => {
  if (a?.length === b?.length && a.filter(t => !b.includes(t))) {
    return true;
  }
  return false;
}

const diffArray = ref([]);
const selectedRuleIndex = ref();

const showArrayDiff = (a, b) => {
  if (!a.length) {
    return [];
  }
  const diffArr = [];
  for (let i = 0; i < a.length; i++) {
    for (let val in a[i]) {
      if (!b.length || (Array.isArray(a[i][val]) && !judgeArrEqual(a[i][val], b[i][val])) || ((!Array.isArray(a[i][val]) && a[i][val] !== b[i][val]))) {
        diffArr.push({
          [val]: a[i].nonTerminal,
        });
      }
    }
  }
  return diffArr;
}

const hanlePlay = () => {
  play.value = !play.value;
}

const tablePlay = () => {
  playStatus.value = false;
  tableData.value = [];
  const genetator = ll1Parser.value.getPredictTableProgressive(firstSet.value, followSet.value);
  rules.value = genetator.next().value;
  // tableData.value = transferData(genetator.next().value?.result);
  const func = () => {
    const data = genetator.next();
    if (data.done) {
      play.value = false;
    } else {
      diffArray.value = showArrayDiff(transferData(data.value?.result), tableData.value);
      if (diffArray.value[0]) {
        selectedSet.value = {
          [data.value?.ruleIndex === 0 ? 'FIRST' : 'FOLLOW']: Object.values(diffArray.value[0])[0]
        }
      }
      tableData.value = transferData(data.value?.result);
      selectedRuleIndex.value = data.value?.ruleIndex;
    }
  };
  interval.value = setInterval(func, 2500);
}

onUnmounted(() => {
  clearInterval(interval.value);
  clearInterval(intervalFirst.value);
})

const genfirstData = () => {
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
  displayData.value = arr;
}

const cellClassName = ({ row, column }) => {
  for (let i = 0; i < diffArray.value.length; i++) {
    if (column.rawColumnKey === Object.keys(diffArray.value[i])[0] && row.nonTerminal === Object.values(diffArray.value[i])[0]) {
      return 'highlight';
    }
  }
  return '';
}

const setClassName = ({ row, column }) => {
  const keys = Object.keys(selectedSet.value);
  const values = Object.values(selectedSet.value);
  let className = '';
  for (let i = 0; i < keys.length; i++) {
    if (column.label === keys[i]) {
      if (!Array.isArray(values[i]) && row.nonTerminal === values[i]) {
        className = 'highlight';
      }
      if (Array.isArray(values[i])) {
        values[i].forEach((value) => {
          if (row.nonTerminal === value) {
            className = 'highlight';
          }
        })
      }
    }
  }
  return className;
}

watch(() => play, (newValue) => {
  clearInterval(interval.value);
  diffArray.value = [];
  selectedSet.value = {};
  rules.value = [];
  selectedRuleIndex.value = -1;
  if (newValue.value) {
    tablePlay();
  } else {
    genTableData();
  };
}, {
  deep: true
})

watch(() => playStatus, (newValue) => {
  clearInterval(intervalFirst.value);
  selectedFirstRules.value = -1;
  selectedSet.value = {};
  if (newValue.value === 1) {
    playFirstData('FIRST');
  } else if (newValue.value === 2) {
    playFirstData('FOLLOW');
  }
  else {
    genfirstData();
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

  :deep(.highlight) {
    background-color: #ecf5ff;
  }

  :deep(.cell) {
    color: #000;
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

    span {
      text-decoration: underline;
      color: #409eff;
      font-weight: 400;
      font-size: 14px;
      cursor: pointer;
      margin-left: 10px;
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
    color: #000;

    li {
      padding: 5px 10px;
    }
  }

  svg {
    cursor: pointer;
  }
}
</style>