import { createStore } from 'vuex';
import createPersistedState from 'vuex-persistedstate'; // 缓存 state内容， 存储在localStorage

const store = createStore({
  plugins: [createPersistedState({
    storage: window.localStorage,
  })],
  state: {
    counter: 0,
  },
  mutations: {
    add(state) {
      state.counter++
    }
  }
});

export default store;