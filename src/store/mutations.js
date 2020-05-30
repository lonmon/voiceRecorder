import lodash from "lodash";
const mutations = {
  addversion(state, newversion) {
    // 把之后的擦掉
    state.historyArr.splice(
      state.currentVersion + 1,
      state.historyArr.length - state.currentVersion + 1
    );
    const v = lodash.cloneDeep(newversion);
    state.historyArr.push(v);
    state.currentVersion++;
  },
  backVersion(state) {
    if (state.currentVersion > 0) {
      state.currentVersion--;
    }
  },
  foreVersion(state) {
    console.log(state.currentVersion);

    if (state.historyArr.length > state.currentVersion) {
      state.currentVersion++;
    }
  },
};

export default mutations;
