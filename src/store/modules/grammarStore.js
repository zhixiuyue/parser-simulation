const grammarState = {
  grammar: [],
  nonTerminal: [],
  terminal: [],
  customMode: false,
  initialGrammar: [],
  startGrammar: [],
  startNonTerminal: [],
  startTerminal: [],
};

const LL1State = {
  LL1ParserString: "",
  LL1StartNonTerminal: "",
  ll1Parser: "",
  firstSet: [],
  followSet: [],
  hideFirset: false,
};

const LRState = {
  LRParsingString: "",
  LRStartNonTerminal: "",
  LRPredictTable: [],
  lRParser: "",
  graph: [],
  argument: "",
  dfaPlayMethod: 2,
  hideLRTable: false,
};

const LR1LALRState = {
  LRParsingString: "",
  LRStartNonTerminal: "",
  LR1LALRPredictTable: [],
  LR1LALRType: "LR1",
  lR1Parser: "",
  graph: [],
  argument: "",
  dfaPlayMethod: 2,
  hideLRTable: false,
};

const state = {
  ...grammarState,
  ...LL1State,
  ...LRState,
  ...LR1LALRState,
  step: 1,
  unfold: true,
  showInitail: false,
  showArgument: false,
};

const getters = {
  getGrammar: (state) => {
    return state.grammar;
  },
  getInitialGrammar: (state) => {
    return state.initialGrammar;
  },
  getNonTerminal: (state) => {
    return state.nonTerminal;
  },
  getTerminal: (state) => {
    return state.terminal.map((value) => {
      return value[0];
    });
  },
  getStartGrammar: (state) => {
    return state.startGrammar;
  },
  getStartNonTerminal: (state) => {
    return state.startNonTerminal;
  },
  getStartTerminal: (state) => {
    return state.startTerminal.map((value) => {
      return value[0];
    });
  },
  getCustomMode: (state) => {
    return state.customMode;
  },
  getLL1ParserString: (state) => {
    return state.LL1ParserString;
  },
  getLL1StartNonTerminal: (state) => {
    return state.LL1StartNonTerminal;
  },
  getLL1Parser: (state) => {
    return state.ll1Parser;
  },
  getFirstSet: (state) => {
    return state.firstSet;
  },
  getFollowSet: (state) => {
    return state.followSet;
  },
  getLRParsingString: (state) => {
    return state.LRParsingString;
  },
  getLRStartNonTerminal: (state) => {
    return state.LRStartNonTerminal;
  },
  getLRPredictTable: (state) => {
    return state.LRPredictTable;
  },
  getLR1LALRPredictTable: (state) => {
    return state.LR1LALRPredictTable;
  },
  getLR1LALRParser: (state) => {
    return state.lR1Parser;
  },
  getLR1LALRType: (state) => {
    return state.LR1LALRType;
  },
  getLRParser: (state) => {
    return state.lRParser;
  },
  getGraph: (state) => {
    return state.graph;
  },
  getArgument: (state) => {
    return state.argument;
  },
  getStartTNonTer: (state) => {
    return state.grammar[0]?.split(" => ")[0];
  },
  getStep: (state) => {
    return state.step;
  },
  getHideFirset: (state) => {
    return state.hideFirset;
  },
  getUnFold: (state) => {
    return state.unfold;
  },
  getShowInitail: (state) => {
    return state.showInitail;
  },
  getShowArgument: (state) => {
    return state.showArgument;
  },
  getDfaPlayMethod: (state) => {
    return state.dfaPlayMethod;
  },
  getHideLRTable: (state) => {
    return state.hideLRTable;
  },
};

const clearData = (state) => {
  state.LL1ParserString = "";
  state.LL1StartNonTerminal = "";
  state.LRParsingString = "";
  state.LRStartNonTerminal = "";
  state.LRPredictTable = [];
  state.LR1LALRPredictTable = [];
  state.graph = [];
  state.argument = "";
  state.showArgument = false;
  state.ll1Parser = "";
  state.lRParser = "";
  state.dfaPlayMethod = 2;
};

const mutations = {
  updateGrammar: (state, grammar) => {
    state.grammar = grammar;
    clearData(state);
  },
  updateInitialGrammar: (state, grammar) => {
    state.initialGrammar = grammar;
  },
  updateNonTerminal: (state, nonTerminal) => {
    state.nonTerminal = nonTerminal;
  },
  updateTerminal: (state, terminal) => {
    state.terminal = terminal;
  },
  updateStartGrammar: (state, grammar) => {
    state.startGrammar = grammar;
  },
  updateStartNonTerminal: (state, nonTerminal) => {
    state.startNonTerminal = nonTerminal;
  },
  updateStartTerminal: (state, terminal) => {
    state.startTerminal = terminal;
  },
  updateCustomMode: (state, mode) => {
    state.customMode = mode;
  },
  updateLL1ParserString: (state, string) => {
    state.LL1ParserString = string;
  },
  updateLL1StartNonTerminal: (state, value) => {
    state.LL1StartNonTerminal = value;
  },
  updateLL1Parser: (state, value) => {
    state.ll1Parser = value;
  },
  updateFirstSet: (state, value) => {
    state.firstSet = value;
  },
  updateFollowSet: (state, value) => {
    state.followSet = value;
  },
  updateLRParsingString: (state, value) => {
    state.LRParsingString = value;
  },
  updateLRStartNonTerminal: (state, value) => {
    state.LRStartNonTerminal = value;
  },
  updateLRPredictTable: (state, value) => {
    state.LRPredictTable = value;
  },
  updateLR1LALRPredictTable: (state, value) => {
    state.LR1LALRPredictTable = value;
  },
  updateLRParser: (state, value) => {
    state.lRParser = value;
  },
  updateLR1LALRParser: (state, value) => {
    state.lR1Parser = value;
  },
  updateLR1LALRType: (state, value) => {
    state.LR1LALRType = value;
  },
  updateGraph: (state, value) => {
    state.graph = value;
  },
  updateArgument: (state, value) => {
    state.argument = value;
  },
  updateStep: (state, value) => {
    state.step = value;
  },
  updateHideFirset: (state, value) => {
    state.hideFirset = value;
  },
  updateUnfold: (state, value) => {
    state.unfold = value;
  },
  updateShowInitail: (state, value) => {
    state.showInitail = value;
  },
  updateShowArgument: (state, value) => {
    state.showArgument = value;
  },
  updateDfaPlayMethod: (state, value) => {
    state.dfaPlayMethod = value;
  },
  updateHideLRTable: (state, value) => {
    state.hideLRTable = value;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
