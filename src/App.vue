<template>
  <div id="app" class="mb-4">
    <Header />
    <ClearStorage />
    <h2>
      <span v-if="organisation.id">{{ organisation.name }}</span>
      <span v-if="team.id">, {{ team.name }}</span>
      <span v-if="member.id">, {{ member.name }}</span>
      <i v-if="member.facilitator" class="fas fa-brain" title="I am the facilitator/controller" />
    </h2>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab == 'facilitator'">
      <FacilitatorView />
    </div>
    <div v-if="showTab == 'game'">
      <div class="game-params">
        <Away />
        <SetGame />
        <SetFacilitator v-if="organisation && organisation.facilitatorControls" />
        <WalkThroughView v-if="!organisation.id" />
        <GameView v-if="organisation.id && team.id && member.id" />
      </div>
      <div v-if="!organisation.id" class="poker-train" />
      <div v-if="organisation.id && gameView == 'poker'" class="container">
        <div v-if="team.name">
          <table class="poker-table" border>
            <tr>
              <td class="backlog">
                <Backlog />
              </td>
              <td class="poker">
                <Poker />
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-if="organisation && gameView == 'train'" class="container">
        <Train v-if="organisation && gameView == 'train'" />
      </div>
    </div>
  </div>
</template>

<script>
import bus from './socket.js'

import params from './lib/params.js'

import Header from './components/Header.vue'
import ClearStorage from './components/ClearStorage.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import AboutView from './components/about/AboutView.vue'
import FacilitatorView from './components/FacilitatorView.vue'
import Away from './components/Away.vue'
import SetGame from './components/SetGame.vue'
import SetFacilitator from './components/SetFacilitator.vue'
import GameView from './components/GameView.vue'
import Backlog from './components/Backlog.vue'
import Poker from './components/Poker.vue'
import Train from './components/Train.vue'

export default {
  name: 'App',
  components: {
    Header,
    ClearStorage,
    WalkThroughView,
    AboutView,
    FacilitatorView,
    SetFacilitator,
    Away,
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
    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    bus.$emit('sendCheckSystemWorkshops')

    bus.$on('loadOrganisations', (data) => {
      this.$store.dispatch('updateOrganisations', data)

      const orgId = localStorage.getItem('organisation-pp')
      if (orgId) {
        this.$store.dispatch('updateOrganisation', orgId)
      }

      const teamId = localStorage.getItem('team-pp')
      if (orgId && teamId) {
        this.$store.dispatch('updateTeam', teamId)
        bus.$emit('sendLoadTeam', {organisationId: orgId, teamId: teamId})
      }

      const memberId = localStorage.getItem('member-pp')
      if (memberId) {
        this.$store.dispatch('updateMember', memberId)
      }
    })

    bus.$on('loadTeam', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('loadTeam', data)
        this.$store.dispatch('updateMember', data.memberId)
      }
    })

    bus.$on('memberAction', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.setMemberStatus(data)
      }
    })

    bus.$on('loadOrganisation', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('loadOrganisation', data)
      }
    })

    bus.$on('loadTeams', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('loadTeams', data)
      }
    })

    bus.$on('updateEstimationType', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('updateEstimationType', data)
      }
    })

    bus.$on('updateEstimateTeam', (data) => {
      if (this.organisation.id == data.organisationId) {
        this.$store.dispatch('updateEstimateTeam', data)
      }
    })

    bus.$on('updateTimer', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        if (this.$store.getters.getTimerRunning) {
          this.$store.dispatch('updateTimer', data)
        }
      }
    })

    bus.$on('stopTimer', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('stopTimer', data)
      }
    })

    bus.$on('reveal', (data) => {
      if (this.team.id == data.teamId && this.organisation.id == data.organisationId) {
        this.$store.dispatch('reveal', data)
      }
    })

    bus.$on('updateConnections', (data) => {
      this.$store.dispatch('updateConnections', data)
    })
  },
  methods: {
    setMemberStatus(data) {
      if (data.memberId != this.member.id) {
        const member = data.team.members.find((m) => {
          return m.id == data.memberId
        })
        let str = ''
        if (member.coffee) {
          str = str + ' has requested a coffee break'
        } else if (member.question) {
          str = str + ' would like to ask a question'
        }
        if (str) {
          str = member.name + str
          alert(str)
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .not-host {
    height: 0px;
    visibility: hidden;
  }

  .connections {
    text-align: right;
    margin: 6px
  }

  .game-params {
    height: 60px;
    text-align: center;
  }

  .fa-brain {
    margin-left: 6px;
    color: darksalmon;
    display: inline-block;
    text-shadow: 1px 1px 1px #888;
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
