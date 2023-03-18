import { createStore } from 'vuex';
import grammarStore from './modules/grammarStore';

// 调用createStore
export default createStore({
    modules: {
        grammarStore
    }
})