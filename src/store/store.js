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
    organisations: [],
    organisation: {},
    team: {},
    member: {},
    time: 0,
    timerRunning: false,
    revealed: false,
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
    getShowTab: (state) => {
      return state.showTab
    },
    getGameView: (state) => {
      return state.team.gameView
    },
    getOrganisations: (state) => {
      return state.organisations
    },
    getOrganisation: (state) => {
      return state.organisation
    },
    getTeam: (state) => {
      return state.team
    },
    getMember: (state) => {
      return state.member
    },
    getTeams: (state) => {
      return state.organisation.teams
    },
    getIncludedTeams: (state) => {
      const teams = []
      if (state.organisation && state.organisation.teams.length) {
        for (let i = 0; i < state.organisation.teams.length; i++) {
          if (state.organisation.teams[i].include) {
            teams.push(state.organisation.teams[i])
          }
        }
      }
      return teams
    },
    getTeamMembers: (state) => {
      return state.team.members
    },
    getSelectedCard: (state) => {
      const card = state.team.backlog.find(function(c) {
        return c.selected
      })
      return card ? card : false
    },
    getEstimationType: (state) => {
      return state.team.estimationType
    },
    getTimerRunning: (state) => {
      return state.timerRunning
    },
    getTime: (state) => {
      return state.time
    },
    getRevealed: (state) => {
      return state.revealed
    },
    getEstimationTypes: (state) => {
      return Object.keys(state.team.estimationValues)
    },
    getEstimationValues: (state) => {
      let values
      if (state.team.estimationValues && state.team.estimationType) {
        values = state.team.estimationValues[state.team.estimationType]
      } else {
        values = []
      }
      return values
    },
    getConnections: (state) => {
      return state.connections
    },
    getBacklog: (state) => {
      let backlog = state.team.backlog
      if (state.team.gameView == 'train') {
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
      return state.team.velocity
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
    updateOrganisation: (state, payload) => {
      state.organisation = state.organisations.find(function(o) {
        return o.id == payload
      })
    },
    updateTeam: (state, payload) => {
      state.team = state.organisation.teams.find(function(t) {
        return t.id == payload
      })
    },
    updateMember: (state, payload) => {
      state.member = state.team.members.find(function(m) {
        return m.id == payload
      })
    },
    updateOrganisations: (state, payload) => {
      state.organisations = payload
    },
    loadOrganisation: (state, payload) => {
      state.organisation = payload
    },
    loadTeam: (state, payload) => {
      state.team = payload.team
    },
    updateEstimationType: (state, payload) => {
      state.estimationType = payload.estimationType
    },
    updateEstimateTeam: (state, payload) => {
      state.editing.estimateTeam = payload.estimateTeam
    },
    startTimer: (state, payload) => {
      state.timerRunning = true
    },
    updateTimer: (state, payload) => {
      if (state.timerRunning) {
        state.time = payload.time
      }
    },
    stopTimer: (state, payload) => {
      state.time = 0
      state.timerRunning = false
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
    updateMember: ({ commit }, payload) => {
      commit('updateMember', payload)
    },
    updateTeam: ({ commit }, payload) => {
      commit('updateTeam', payload)
    },
    updateOrganisation: ({ commit }, payload) => {
      commit('updateOrganisation', payload)
    },
    updateOrganisations: ({ commit }, payload) => {
      commit('updateOrganisations', payload)
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
    startTimer: ({ commit }, payload) => {
      commit('startTimer', payload)
    },
    updateTimer: ({ commit }, payload) => {
      commit('updateTimer', payload)
    },
    stopTimer: ({ commit }, payload) => {
      commit('stopTimer', payload)
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
