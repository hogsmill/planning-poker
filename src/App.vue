<template>
  <div id="app" class="mb-4">
    <Header />
    <h1>
      Planning Poker
    </h1>
    <h2>
      <span v-if="organisation.id">({{ organisation.name }}</span>
      <span v-if="team.id">, {{ team.name }}</span>
      <span v-if="member.id">, {{ member.name }}</span>
      <span v-if="organisation.id">)</span>
    </h2>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab == 'facilitator'">
      <FacilitatorView :socket="socket" />
    </div>
    <div v-if="showTab == 'game'">
      <div class="game-params">
        <SetGame :socket="socket" />
        <WalkThroughView v-if="!organisation.id" />
        <GameView v-if="organisation.id && team.id && member.id" :socket="socket" />
      </div>
      <div v-if="!organisation.id" class="poker-train" />
      <div v-if="organisation.id && gameView == 'poker'" class="container">
        <div v-if="team.name">
          <table class="poker-table" border>
            <tr>
              <td class="backlog">
                <Backlog :socket="socket" />
              </td>
              <td class="poker">
                <Poker :socket="socket" />
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="organisation && gameView == 'train'" class="container">
        <Train v-if="organisation && gameView == 'train'" :socket="socket" />
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import AboutView from './components/about/AboutView.vue'
import FacilitatorView from './components/FacilitatorView.vue'
import SetGame from './components/SetGame.vue'
import GameView from './components/GameView.vue'
import Backlog from './components/Backlog.vue'
import Poker from './components/Poker.vue'
import Train from './components/Train.vue'

export default {
  name: 'App',
  components: {
    Header,
    WalkThroughView,
    AboutView,
    FacilitatorView,
    SetGame,
    GameView,
    Backlog,
    Poker,
    Train
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showTab() {
      return this.$store.getters.getShowTab
    },
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    member() {
      return this.$store.getters.getMember
    },
    gameView() {
      return this.$store.getters.getGameView
    }
  },
  created() {
    let connStr
    if (location.hostname == 'localhost') {
      connStr = 'http://localhost:3004'
    } else {
      connStr = 'https://agilesimulations.co.uk:3004'
    }
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    this.socket.emit('checkSystemWorkshops')

    this.socket.on('loadOrganisations', (data) => {
      this.$store.dispatch('updateOrganisations', data)

      const orgId = localStorage.getItem('organisation-pp')
      if (orgId) {
        this.$store.dispatch('updateOrganisation', orgId)
        this.socket.emit('setOrganisation', {organisationId: orgId})
      }

      const teamId = localStorage.getItem('team-pp')
      if (orgId && teamId) {
        this.$store.dispatch('updateTeam', teamId)
        this.socket.emit('loadTeam', {organisationId: orgId, teamId: teamId})
      }

      const memberId = localStorage.getItem('member-pp')
      if (memberId) {
        this.$store.dispatch('updateMember', memberId)
      }
    })

    this.socket.on('loadTeam', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
      console.log(data)
        this.$store.dispatch('loadTeam', data)
      }
    })

    this.socket.on('loadOrganisation', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('loadOrganisation', data)
      }
    })

    this.socket.on('loadTeams', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('loadTeams', data)
      }
    })

    this.socket.on('updateEstimationType', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('updateEstimationType', data)
      }
    })

    this.socket.on('updateEstimateTeam', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('updateEstimateTeam', data)
      }
    })

    this.socket.on('updateTimer', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('updateTimer', data)
      }
    })

    this.socket.on('reveal', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('reveal', data)
      }
    })

    this.socket.on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  }
}
</script>

<style lang="scss">
  .not-host { height: 0px; visibility: hidden; }
  .connections {
    text-align: right;
    margin: 6px
  }
  .game-params {
    height: 60px;
    text-align: center;
  }
  .poker-train {
     width: 800px;
     height: 400px;
     margin: 0 auto;
     background-image: url("./assets/img/poker-train.png");
     background-size: contain;
     background-repeat: no-repeat;
     background-position: center;
  }
  .poker-table {
    background-color: #35654d;
    color: #fff;
    margin: 0 auto;
    width: 100%;
    .backlog {
      width: 25%;
      vertical-align: top;
    }
    .poker {
      width: 75%;
      vertical-align: top;
    }
  }

</style>
