import Vue from "vue";
import Vuex from "vuex";

import lodash from "lodash";

Vue.use(Vuex);

const state = {
  historyArr: [],
  currentVersion: -1,
};

const mutations = {
  addversion(state, newversion) {
    console.log(newversion, state.historyArr, state.currentVersion);
    // 把之后的擦掉
    state.historyArr.splice(
      state.currentVersion + 1,
      state.historyArr.length - 1
    );
    let v = lodash.cloneDeep(newversion);
    state.historyArr.push(v);
    console.log(state.historyArr);
    state.currentVersion++;
  },
  backVersion(state) {
    state.currentVersion > 0 && state.currentVersion--;
  },
  foreVersion(state) {
    state.historyArr.length > state.currentVersion && state.currentVersion++;
  },
};
const store = new Vuex.Store({
  state,
  mutations,
});

export default store;
