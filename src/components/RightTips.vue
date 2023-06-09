<template>
  <div class="right-contant-container">
    <el-icon class="fold-icon" @click="toggleFold">
      <Expand v-if="unfold" />
      <Fold v-else />
    </el-icon>
    <div class="right-contant" v-show="unfold">
      <el-steps direction="vertical" :active="activeStep" class="steps">
        <el-step :class="activeStep === 1 ? 'active-step' : 'step'">
          <template #title>
            <InputGrammar />
          </template>
        </el-step>
        <el-step :class="activeStep === 2 ? 'active-step' : 'step'">
          <template #title>
            <el-collapse :model-value="activeName" class="collapse">
              <el-collapse-item name="1">
                <template #title>
                  <div class="select-title">
                    分析算法选择
                    <el-tooltip v-if="type" class="box-item" effect="dark" :content=content placement="top">
                      <el-icon @click="transfer($event)">
                        <Switch />
                      </el-icon>
                    </el-tooltip>
                  </div>
                </template>
                <LL1 v-if="type === 'LL1'" />
                <LR0 v-else-if="
                  type === 'LR0'
                " />
                <LR1LALR v-else-if="
                  type === 'LR1LALR'
                " />
                <div v-else v-for="item in analysisItems" :key="item.text">
                  <span class="jump" @click="jump(item)">{{ item.text }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template></el-step>
      </el-steps>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import InputGrammar from "@/components/Right/InputGrammar.vue";
import LL1 from "@/components/Right/LL1.vue";
import LR0 from "@/components/Right/LR0.vue";
import LR1LALR from "@/components/Right/LR1LALR.vue";
import { analysisItems } from "@/dataList.js";
import { genLL1, genLR0, genLR1LALR } from "@/genParser.js";
import { ElMessage } from "element-plus";
const store = useStore();
const router = useRouter();

const type = computed(() => {
  return router.currentRoute.value.path.split('/')[1];
})

const content = computed(() => {
  return type.value === "LL1" ? '切换至LR(k)分析' : '切换至LL(1)分析';
});

const unfold = computed(() => {
  return store.getters["grammarStore/getUnFold"];
});

const grammar = computed(() => {
  return store.getters["grammarStore/getGrammar"];
});

const activeStep = computed(() => {
  return store.getters["grammarStore/getStep"];
});

const activeName = ref("1");

const toggleFold = () => {
  store.commit("grammarStore/updateUnfold", !unfold.value);
};

const isModify = ref(true);

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getNonTerminal"];
});

const terminal = computed(() => {
  return store.state.grammarStore.terminal;
});

const transfer = (e) => {
  e.stopPropagation();
  switch (type.value) {
    case 'LL1': {
      const lR = store.getters["grammarStore/getLRParser"];
      if (!lR) {
        genLR0();
      }
      router.push('/LR0');
      break;
    }
    case 'LR0':
    case 'LR1LALR':
      {
        const ll1 = store.getters["grammarStore/getLL1Parser"];
        if (!ll1) {
          try {
            genLL1();
          } catch (error) {
            ElMessage({
              message: '文法输入有误，请检查',
              type: 'error',
            });
            return;
          }
        }
        router.push("/LL1");
        break;
      }
    default:
      break;
  }
}

const jump = (item) => {
  const { route, params, key } = item;
  if (!route) {
    return;
  }
  if (activeStep.value < 2) {
    ElMessage({
      message: "请先输入文法",
      type: "warning",
    });
    return;
  }
  const lR = store.getters["grammarStore/getLRParser"];
  const ll1 = store.getters["grammarStore/getLL1Parser"];
  const LR1 = store.getters["grammarStore/getLR1LALRParser"];
  if (key === "LL1" && (isModify.value || !ll1)) {
    try {
      genLL1();
    } catch (error) {
      ElMessage({
        message: '文法输入有误，请检查',
        type: 'error',
      });
      return;
    }
  } else if (key === "LR0" && (isModify.value || !lR)) {
    genLR0();
  } else if (key === "LR1LALR" && (isModify.value || !LR1)) {
    genLR1LALR();
  }
  router.push({ path: route, query: params });
  isModify.value = false;
};

watch(
  () => activeStep,
  (newValue) => {
    if (newValue.value === 2) {
      activeName.value = "1";
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

watch(
  [() => nonTerminal.value, terminal, grammar],
  () => {
    isModify.value = true;
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less">
.right-contant-container {
  background-color: #fff;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
    rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

  .fold-icon {
    position: absolute;
    right: 25px;
    top: 18px;
    font-size: 18px;
    cursor: pointer;
    z-index: 1;
  }

  .right-contant {
    height: 100%;
    width: 420px;
    padding: 15px 20px;
    overflow: auto;

    .steps {
      // max-height: 100%;
      height: fit-content;
      min-height: 20%;

      .collapse {
        border: none;
        --el-collapse-header-height: 26px;
        --el-collapse-header-font-size: 17px;

        .jump {
          text-decoration: underline;
          cursor: pointer;
          color: #409eff;
          font-weight: 400;
          font-size: 14px;

          &:hover {
            opacity: 0.8;
          }
        }
      }

      :global(.el-step) {
        min-height: 60px;
      }

      :global(.el-step__description) {
        overflow: auto;
        max-height: 95%;
        padding-bottom: 10px;
      }

      :global(.el-step__description.is-finish) {
        color: #000;
      }

      .active-step {
        height: 0;
        flex: 1;
      }

      .step {
        flex: 0;
      }
    }

    .select-title {
      display: flex;
      align-items: center;
      gap: 10px;
    }
  }
}
</style>