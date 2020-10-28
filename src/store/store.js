import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    connections: 0,
    walkThrough: false,
    showTab: 'game',
    host: false,
    myName: {},
    teamName: '',
    teams: [
      { name: 'Eagle' },
      { name: 'Dragon' },
      { name: 'Lion' },
      { name: 'Gryphen' }
    ],
    teamMembers: [],
    backlog: [],
    revealed: false,
    estimationType: 't-shirt',
    estimationValues: {
      't-shirt': ['XS', 'S', 'M', 'L', 'XL'],
      'fibonacci': ['1', '2', '3', '5', '8', '13']
    }
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
    getMyName: (state) => {
      return state.myName
    },
    getTeamName: (state) => {
      return state.teamName
    },
    getTeams: (state) => {
      return state.teams
    },
    getTeamMembers: (state) => {
      return state.teamMembers
    },
    getSelectedCard: (state) => {
      const card = state.backlog.find(function(c) {
        return c.selected
      })
      return card ? card : false
    },
    getEstimationType: (state) => {
      return state.estimationType
    },
    getRevealed: (state) => {
      return state.revealed
    },
    getEstimationTypes: (state) => {
      return Object.keys(state.estimationValues)
    },
    getEstimationValues: (state) => {
      return state.estimationValues[state.estimationType]
    },
    getConnections: (state) => {
      return state.connections
    },
    getBacklog: (state) => {
      return state.backlog
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
    updateMyName: (state, payload) => {
      state.myName = payload
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload
    },
    updateEstimationType: (state, payload) => {
      state.estimationType = payload.estimationType
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    loadTeam: (state, payload) => {
      state.teamMembers = payload.teamMembers
      state.backlog = payload.backlog
    },
    reveal: (state, payload) => {
      state.revealed = payload.reveal
    },
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
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    updateEstimationType: ({ commit }, payload) => {
      commit('updateEstimationType', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    reveal: ({ commit }, payload) => {
      commit('reveal', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
