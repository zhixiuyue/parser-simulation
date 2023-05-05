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
              <el-collapse-item title="分析算法选择" name="1">
                <LL1
                  v-if="router.currentRoute.value.path.split('/')[1] === 'LL1'"
                />
                <LR0
                  v-else-if="
                    router.currentRoute.value.path.split('/')[1] === 'LR0'
                  "
                />
                <LR1LALR
                  v-else-if="
                    router.currentRoute.value.path.split('/')[1] === 'LR1LALR'
                  "
                />
                <div v-else v-for="item in analysisItems" :key="item.text">
                  <span class="jump" @click="jump(item)">{{ item.text }}</span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </template></el-step
        >
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

const unfold = computed(() => {
  return store.getters["grammarStore/getUnFold"];
});
// const unfold = ref(true);
const grammar = computed(() => {
  return store.getters["grammarStore/getGrammar"];
});

// const activeStep = ref(1);

const activeStep = computed(() => {
  return store.getters["grammarStore/getStep"];
});

const activeName = ref("1");

const toggleFold = () => {
  store.commit("grammarStore/updateUnfold", !unfold.value);
  // unfold.value = !unfold.value;
};

const goBack = () => {
  router.push({ path: "/", query: { step: 1 } });
};

const isModify = ref(true);

const nonTerminal = computed(() => {
  return store.getters["grammarStore/getNonTerminal"];
});

const terminal = computed(() => {
  return store.state.grammarStore.terminal;
});

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
  const LR1 = store.getters["grammarStore/getLL1Parser"];
  if (key === "LL1" && (isModify.value || !ll1)) {
    genLL1();
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
  // border-left: 1px solid rgb(219, 219, 219);
  // box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
      max-height: 100%;
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
        // padding-bottom: 10px;
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

    .title {
      display: flex;
      align-items: center;
      gap: 10px;

      .icon {
        cursor: pointer;
      }
    }

    .argument-title {
      font-weight: 600;
    }

    .argument-statement {
      font-size: 14px;
      margin: 10px;
    }

    .argument-ul {
      font-size: 14px;

      li + li {
        margin-top: 10px;
      }
    }
  }
}
</style>