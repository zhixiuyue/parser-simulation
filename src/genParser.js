import lucy from "lucy-compiler";
import store from "./store";

export const genLL1 = () => {
    const terminal = store.state.grammarStore.terminal;
    const nonTerminal = store.getters["grammarStore/getNonTerminal"];
    const grammar = store.getters["grammarStore/getGrammar"];
    const ll1Parser = new lucy.LL1Parser(terminal, nonTerminal, grammar);
    const firstSet = ll1Parser.getFirstSet();
    const followSet = ll1Parser.getFollowSet(firstSet);
    store.commit("grammarStore/updateLL1Parser", ll1Parser);
    store.commit("grammarStore/updateFirstSet", firstSet);
    store.commit("grammarStore/updateFollowSet", followSet);
}

export const genLR0 = () => {
    const lRParser = new lucy.LRParser();
    store.commit("grammarStore/updateLRParser", lRParser);
    const terminal = store.state.grammarStore.terminal;
    const nonTerminal = store.getters["grammarStore/getNonTerminal"];
    const startGrammar = store.getters["grammarStore/getStartGrammar"];
    const startNonTerminal = store.getters["grammarStore/getStartTNonTer"];
    lRParser.generateState(
        startGrammar,
        startNonTerminal,
        nonTerminal,
        terminal
    );
}