import lucy from "lucy-compiler";

const state = {
    grammar: [],
    nonTerminal: [],
    terminal: [],
    customMode: false,
    LL1ParserString: '',
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
    getParser: (state) => {
        const ll1Parser = new lucy.LL1Parser(
            state.terminal,
            state.nonTerminal,
            state.grammar
        );
        return ll1Parser;
    },
    getLL1ParserString: (state) => {
        return state.LL1ParserString;
    },
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
    },
    updateLL1ParserString: (state, string) => {
        state.LL1ParserString = string;
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