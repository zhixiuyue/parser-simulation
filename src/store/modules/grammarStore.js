const state = {
    grammar: [],
    nonTerminal: [],
    terminal: [],
    customMode: false,
}

const getters = {
    getGrammar: (state) => {
        return state.grammar;
    },
    getNonTerminal: (state) => {
        return state.nonTerminal;
    },
    getNonTerminal: (state) => {
        return state.terminal;
    },
    getCustomMode: (state) => {
        return state.customMode;
    }
}

const mutations = {
    updateGrammar: (state, grammar) => {
        state.grammar = grammar;
    },
    updateNonTerminal: (state, nonTerminal) => {
        state.nonTerminal = nonTerminal;
    },
    updateTerminal: (state, terminal) => {
        state.terminal = terminal;
    },
    updateCustomMode: (state, mode) => {
        state.customMode = mode;
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