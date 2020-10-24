import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    connections: 0,
    walkThrough: false,
    host: false,
    showTab: 'game',
    workshop: false,
    workshopName: '',
    workshopResults: [],
    gameName: '',
    myName: '',
    clickedRole: {},
    gameState: {
      interval: 250,
      stopped: false,
      currency: { major: '&pound;', minor: 'p'},
      denominations: {
        200: 1,
        100: 7,
        50: 11,
        20: 21,
        10: 6,
        5: 6,
        2: 10,
        1: 20,
      },
      timeLimit: { demo: 60, click: 120 },
      valueTimeLimit: { demo: 10, click: 20 },
      clickOnCoins: true,
      round: 0,
      total: 0,
      valueDelivered: 0,
      players: [],
      roles: [
        { role: 'Product Owner', include: true, name: '' },
        { role: 'Developer', include: true, name: '' },
        { role: 'Tester', include: true, name: '' },
        { role: 'Integrator', include: true, name: '' },
        { role: 'Customer', include: true, name: '' },
      ],
      rounds: [
        {
          name: 'Batch',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
        {
          name: 'Kanban',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
        {
          name: 'Value First',
          roles: [],
          running: false,
          delivered: 0,
          time: 0,
        },
      ],
    },
  },
  getters: {
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getShowTab: (state) => {
      return state.showTab
    },
    getConnections: (state) => {
      return state.connections
    }
  },
  mutations: {
    updateWalkThrough: (state, payload) => {
      state.walkThrough = payload
    },
    updateHost: (state, payload) => {
      state.host = payload
    },
    updateShowTab: (state, payload) => {
      state.showTab = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    }
  },
  actions: {
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateShowTab: ({ commit }, payload) => {
      commit('updateShowTab', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
