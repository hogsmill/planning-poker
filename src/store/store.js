import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    connections: 0,
    walkThrough: false,
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
    updateMyName: (state, payload) => {
      state.myName = payload
    },
    updateTeamName: (state, payload) => {
      state.teamName = payload
    },
    updateSelectedCard: (state, payload) => {
      let card
      card = state.backlog.find(function(c) {
        return c.selected
      })
      if (card) {
        card.selected = false
      }
      card = state.backlog.find(function(c) {
        return c.id == payload
      })
      card.selected = true
    },
    updateRevealed: (state, payload) => {
      state.revealed = payload
    },
    updateEstimationType: (state, payload) => {
      state.estimationType = payload
    },
    updateEstimateValue: (state, payload) => {
      const member = state.teamMembers.find(function(m) {
        return m.id == state.myName.id
      })
      member.estimate = payload
    },
    updateAgreedEstimateValue: (state, payload) => {
      const card = state.backlog.find(function(c) {
        return c.selected
      })
      card.estimate = payload
    },
    updateConnections: (state, payload) => {
      state.connections = payload
    },
    loadTeam: (state, payload) => {
      state.teamMembers = payload.teamMembers
      state.backlog = payload.backlog
      console.log(state)
    }
  },
  actions: {
    updateWalkThrough: ({ commit }, payload) => {
      commit('updateWalkThrough', payload)
    },
    updateHost: ({ commit }, payload) => {
      commit('updateHost', payload)
    },
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    updateSelectedCard: ({ commit }, payload) => {
      commit('updateSelectedCard', payload)
    },
    updateRevealed: ({ commit }, payload) => {
      commit('updateRevealed', payload)
    },
    updateEstimationType: ({ commit }, payload) => {
      commit('updateEstimationType', payload)
    },
    updateEstimateValue: ({ commit }, payload) => {
      commit('updateEstimateValue', payload)
    },
    updateAgreedEstimateValue: ({ commit }, payload) => {
      commit('updateAgreedEstimateValue', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
