<template>
  <div class="right-LL1">
    <div class="title">LR(1)/LALR分析
      <el-tooltip class="box-item" effect="dark" content="切换至LR(0)/SLR(1)分析" placement="top">
        <el-icon @click="toLR0">
          <Switch />
        </el-icon>
      </el-tooltip>
    </div>
    <el-steps direction="vertical" :active="active" finish-status="success">
      <el-step v-for="(item, index) in LR1LALRRoute" :key="item.text" :title="item.text" :icon="Finished">
        <template #title>
          <div class="step-title">
            <span>{{ item.text }}</span>
            <el-tooltip v-if="index === 1" effect="dark" :content="ignoreLRTable ? '展开此步骤' : '忽略此步骤'" placement="top">
              <el-icon @click="handleIgnore">
                <Remove />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template #description>
          <div v-if="index === 0">
            <div class="rules">
              <div class="jump" @click="showArgument">文法增广</div>
              <div class="argument-statement">
                假定文法G是一个以S为开始符号的文法，构造一个新的文法G‘,称G'是G的增广文法，G'定义如下：
              </div>
              <ul class="argument-ul">
                <li>只增加一个新的非终结符S’(G‘的开始符号)；</li>
                <li>增加一个新的产生式S’->S；</li>
                <li>
                  增广文法会有一个仅含项目S'->S·的状态，这是唯一的接受态；
                </li>
              </ul>
            </div>
            <div class="jump" @click="jump(0)">构造LR(1)自动机</div>
            <div class="switch-container">
              <el-switch v-model="genStep" active-text="分步构建" @change="updateDfaPlayStatus($event, 1)" />
              <el-switch v-model="genAuto" active-text="自动分步" @change="updateDfaPlayStatus($event, 0)" />
            </div>
          </div>
          <div v-if="index === 1 && !ignoreLRTable">
            <div class="jump" @click="jump(1, 'LR(1)')">LR(1)分析表构建</div>
            <div class="jump" @click="jump(1, 'LALR')">LALR分析表构建</div>
          </div>
          <div v-if="index === 2">
            <el-input v-model="inputString" placeholder="请输入待分析字符串" clearable class="input-area" />
            <el-button type="primary" plain class="sure-btn" @click="onFinishInput">开始分析</el-button>
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script setup>
import { LR1LALRRoute } from "@/dataList.js";
import { Finished } from "@element-plus/icons-vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { genLR0 } from "@/genParser.js";

const store = useStore();
const active = ref(0);
const router = useRouter();
const inputString = ref("");

const jump = (index, type) => {
  active.value = index;
  router.push(LR1LALRRoute[index].route);
  if (type) {
    store.commit("grammarStore/updateLR1LALRType", type);
  }
};

const showArgument = () => {
  const argument = store.getters["gramsmarStore/getArgument"];
  if (!argument) {
    const lR1Parser = store.getters["grammarStore/getLR1LALRParser"];
    if (!lR1Parser) return;
    const stateNodeValue = lR1Parser.stateGraph;
    store.commit("grammarStore/updateArgument", stateNodeValue?.items[0]);
  }
  store.commit("grammarStore/updateShowArgument", true);
};

const genStep = ref(false);
const genAuto = ref(false);

const updateDfaPlayStatus = (val, param) => {
  if (val) {
    store.commit("grammarStore/updateDfaPlayMethod", param);
    if (param === 0) {
      genStep.value = false;
    } else if (param === 1) {
      genAuto.value = false;
    }
  } else {
    if (!genStep.value && !genAuto.value) {
      store.commit("grammarStore/updateDfaPlayMethod", 2);
    }
  }
};

const ignoreLRTable = computed(() => {
  return store.getters["grammarStore/getHideLRTable"];
});

const handleIgnore = () => {
  store.commit("grammarStore/updateHideLRTable", !ignoreLRTable.value);
};

const onFinishInput = () => {
  if (!inputString.value) {
    return;
  }
  store.commit("grammarStore/updateLRParsingString", inputString.value);
  jump(2);
};

const toLR0 = () => {
  const lR = store.getters["grammarStore/getLRParser"];
  if (!lR) {
    genLR0();
  }
  router.push('/LR0');
};
</script>

<style lang="less" scoped>
.right-LL1 {
  .title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      cursor: pointer;
    }
  }

  .step-title {
    display: flex;
    align-items: center;
    gap: 10px;

    svg {
      cursor: pointer;
    }
  }

  .step-icon {
    :global(.el-step__icon svg) {
      width: 20px;
      height: 20px;
    }
  }

  :global(.el-step__description.is-success) {
    color: #000;
  }

  .rules {
    font-size: 14px;

    .argument-statement {
      margin: 10px;
    }

    .argument-ul {
      li+li {
        margin-top: 10px;
      }
    }
  }

  .switch-container {
    display: flex;
    flex-direction: column;
  }

  .btn-save {
    float: right;
  }

  .jump {
    margin-top: 10px;
    text-decoration: underline;
    cursor: pointer;
    color: #409eff;
    font-weight: 400;
    font-size: 14px;

    &:hover {
      opacity: 0.8;
    }
  }

  .input-area {
    width: 290px;
    margin-top: 10px;
  }

  .sure-btn {
    float: right;
    margin-top: 10px;
  }
}
</style>