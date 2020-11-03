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
    organisation: 'hogsmill',
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
    },
    editing: {
      showTeams: false,
      showTeamMembers: false,
      showEstimates: false,
      showBacklog: false
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
    getOrganisation: (state) => {
      return state.organisation
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
    },
    getShowTeams: (state) => {
      return state.editing.showTeams
    },
    getShowTeamMembers: (state) => {
      return state.editing.showTeamMembers
    },
    getShowEstimates: (state) => {
      return state.editing.showEstimates
    },
    getShowBacklog: (state) => {
      return state.editing.showBacklog
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
    updateOrganisation: (state, payload) => {
      state.organisation = payload
    },
    updateEstimationType: (state, payload) => {
      state.estimationType = payload.estimationType
    },
    loadTeam: (state, payload) => {
      state.teamMembers = payload.teamMembers
      state.backlog = payload.backlog
      state.estimationValues = payload.estimationValues
    },
    reveal: (state, payload) => {
      state.revealed = payload.reveal
    },
    setShowTeams: (state, payload) => {
      state.editing.showTeams = payload
    },
    setShowTeamMembers: (state, payload) => {
      state.editing.showTeamMembers = payload
    },
    setShowEstimates: (state, payload) => {
      state.editing.showEstimates = payload
    },
    setShowBacklog: (state, payload) => {
      state.editing.showBacklog = payload
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
    updateMyName: ({ commit }, payload) => {
      commit('updateMyName', payload)
    },
    updateTeamName: ({ commit }, payload) => {
      commit('updateTeamName', payload)
    },
    updateOrganisation: ({ commit }, payload) => {
      commit('updateOrganisation', payload)
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
    setShowTeams: ({ commit }, payload) => {
      commit('setShowTeams', payload)
    },
    setShowTeamMembers: ({ commit }, payload) => {
      commit('setShowTeamMembers', payload)
    },
    setShowEstimates: ({ commit }, payload) => {
      commit('setShowEstimates', payload)
    },
    setShowBacklog: ({ commit }, payload) => {
      commit('setShowBacklog', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
