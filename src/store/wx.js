export default {
  namespaced: true,
  state: {
    url: ''
  },
  mutations: {
    setData(state, data) {
      state[data[0]] = data[1]
    }
  },
  actions: {}
}
