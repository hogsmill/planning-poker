import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    thisGame: 'Planning Poker',
    connections: 0,
    walkThrough: false,
    showTab: 'game',
    host: false,
    demo: false,
    myName: {},
    teamName: '',
    thisTeam: '',
    organisation: '',
    teams: [],
    teamMembers: [],
    gameView: 'poker',
    backlog: [],
    time: 0,
    revealed: false,
    estimationType: '',
    estimationValues: {},
    editing: {
      showTeams: false,
      showTeamMembers: false,
      showEstimates: false,
      showBacklog: false,
      backlogTeam: {},
      estimateTeam: ''
    }
  },
  getters: {
    thisGame: (state) => {
      return state.thisGame
    },
    getWalkThrough: (state) => {
      return state.walkThrough
    },
    getHost: (state) => {
      return state.host
    },
    getDemo: (state) => {
      return state.demo
    },
    getShowTab: (state) => {
      return state.showTab
    },
    getGameView: (state) => {
      return state.thisTeam.gameView
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
    getThisTeam: (state) => {
      console.log(state.thisTeam)
      return state.thisTeam
    },
    getTeams: (state) => {
      return state.teams
    },
    getIncludedTeams: (state) => {
      const teams = []
      for (let i = 0; i < state.teams.length; i++) {
        if (state.teams[i].include) {
          teams.push(state.teams[i])
        }
      }
      return teams
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
    getTime: (state) => {
      return state.time
    },
    getRevealed: (state) => {
      return state.revealed
    },
    getEstimationTypes: (state) => {
      return Object.keys(state.estimationValues)
    },
    getEstimationValues: (state) => {
      let values
      if (state.estimationValues && state.estimationType) {
        values = state.estimationValues[state.estimationType]
      } else {
        values = []
      }
      return values
    },
    getConnections: (state) => {
      return state.connections
    },
    getBacklog: (state) => {
      let backlog = state.backlog
      if (state.gameView == 'train') {
        backlog = backlog.sort(function(a, b) {
          const orderA = parseInt(a.order)
          const orderB = parseInt(b.order)
          return orderA - orderB
        })
      } else {
        backlog = backlog.sort(function(a, b) {
          const orderA = a.estimate ? parseInt(a.estimate.order) : 0
          const orderB = a.estimate ? parseInt(a.estimate.order) : 0
          return orderB - orderA
        })
      }
      return backlog
    },
    getVelocity: (state) => {
      return state.thisTeam.velocity
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
    },
    getBacklogTeam: (state) => {
      return state.editing.backlogTeam
    },
    getEstimateTeam: (state) => {
      return state.editing.estimateTeam
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
    loadOrganisation: (state, payload) => {
      state.organisation = payload.organisation
      state.demo = payload.demo
      if (payload.teams) {
        state.teams = payload.teams
      }
      state.estimationValues = payload.estimationValues
    },
    loadTeams: (state, payload) => {
      state.teams = payload.teams
    },
    updateEstimationType: (state, payload) => {
      state.estimationType = payload.estimationType
    },
    updateEstimateTeam: (state, payload) => {
      state.editing.estimateTeam = payload.estimateTeam
    },
    loadTeam: (state, payload) => {
      state.demo = payload.demo
      state.thisTeam = payload.team
      state.teamMembers = payload.team.members
      state.gameView = payload.team.gameView
      state.backlog = payload.team.backlog
      state.estimationType = payload.team.estimationType
      state.estimationValues = payload.team.estimationValues
    },
    updateTimer: (state, payload) => {
      state.time = payload.time
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
    setBacklogTeam: (state, payload) => {
      state.editing.backlogTeam = state.teams.find(function(t) {
        return t.name == payload
      })
    },
    setEstimateTeam: (state, payload) => {
      state.editing.estimateTeam = state.teams.find(function(t) {
        return t.name == payload
      })
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
    loadOrganisation: ({ commit }, payload) => {
      commit('loadOrganisation', payload)
    },
    loadTeams: ({ commit }, payload) => {
      commit('loadTeams', payload)
    },
    updateEstimationType: ({ commit }, payload) => {
      commit('updateEstimationType', payload)
    },
    updateEstimateTeam: ({ commit }, payload) => {
      commit('updateEstimateTeam', payload)
    },
    loadTeam: ({ commit }, payload) => {
      commit('loadTeam', payload)
    },
    updateTimer: ({ commit }, payload) => {
      commit('updateTimer', payload)
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
    setBacklogTeam: ({ commit }, payload) => {
      commit('setBacklogTeam', payload)
    },
    setEstimateTeam: ({ commit }, payload) => {
      commit('setEstimateTeam', payload)
    },
    updateConnections: ({ commit }, payload) => {
      commit('updateConnections', payload)
    }
  },
})
