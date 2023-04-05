const grammarState = {
    grammar: [],
    nonTerminal: [],
    terminal: [],
    customMode: false,
}

const LL1State = {
    LL1ParserString: '',
    LL1StartNonTerminal: '',
    ll1Parser: "",
    firstSet: [],
    followSet: [],
}

const LRState = {
    LRParsingString: '',
    LRStartNonTerminal: '',
    LRPredictTable: [],
    lRParser: "",
    graph: [],
    argument: "",
}

const state = {
    ...grammarState,
    ...LL1State,
    ...LRState,
}

const getters = {
    getGrammar: (state) => {
        return state.grammar;
    },
    getNonTerminal: (state) => {
        return state.nonTerminal;
    },
    getTerminal: (state) => {
        return state.terminal.map((value) => {
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
        return state.grammar[0].split(" => ")[0];
    }
}

const clearData = (state) => {
    state.LL1ParserString = '';
    state.LL1StartNonTerminal = '';
    state.LRParsingString = '';
    state.LRStartNonTerminal = '';
    state.LRPredictTable = [];
    state.graph = [];
    state.argument = "";
}

const mutations = {

    updateGrammar: (state, grammar) => {
        state.grammar = grammar;
        clearData(state);
    },
    updateNonTerminal: (state, nonTerminal) => {
        state.nonTerminal = nonTerminal;
    },
    updateTerminal: (state, terminal) => {
        state.terminal = terminal;
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
    updateLRParser: (state, value) => {
        state.lRParser = value;
    },
    updateGraph: (state, value) => {
        state.graph = value;
    },
    updateArgument: (state, value) => {
        state.argument = value;
    }
}

const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}