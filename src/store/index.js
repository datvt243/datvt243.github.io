import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import state from "./state";
import getters from "./getters";
export default new Vuex.Store({
  state,
  getters,
  mutations: {},
  actions: {},
  modules: {}
});
