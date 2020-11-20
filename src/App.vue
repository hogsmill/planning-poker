<template>
  <div id="app" class="mb-4">
    <Header />
    <WalkThroughView />
    <h1>Planning Poker<span v-if="organisation">: {{ organisation }}</span> <span v-if="demo">(Demo)</span></h1>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab == 'facilitator'">
      <FacilitatorView :socket="socket" />
    </div>
    <div v-if="showTab == 'game'">
      <div class="game-params">
        <Organisation :socket="socket" />
        <MyName v-if="organisation" :socket="socket" />
        <TeamName v-if="organisation" :socket="socket" />
      </div>
      <div v-if="organisation" class="container">
        <div v-if="teamName">
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
import Organisation from './components/Organisation.vue'
import MyName from './components/MyName.vue'
import TeamName from './components/TeamName.vue'
import Backlog from './components/Backlog.vue'
import Poker from './components/Poker.vue'

export default {
  name: 'App',
  components: {
    Header,
    WalkThroughView,
    AboutView,
    FacilitatorView,
    Organisation,
    MyName,
    TeamName,
    Backlog,
    Poker
  },
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    demo() {
      return this.$store.getters.getDemo
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
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  created() {
    let host = '77.68.122.69'
    if (location.hostname == 'localhost') {
      host = 'localhost'
    }
    const connStr = 'http://' + host + ':3004'
    console.log('Connecting to: ' + connStr)
    this.socket = io(connStr)

    if (params.isParam('host')) {
      this.$store.dispatch('updateHost', true)
    }

    const org = localStorage.getItem('organisation-pp')
    if (org) {
      this.$store.dispatch('updateOrganisation', org)
      this.socket.emit('setOrganisation', {organisation: org})
    }

    const teamName = localStorage.getItem('teamName-pp')
    if (org && teamName) {
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {organisation: org, teamName: teamName})
    }

    let myName = localStorage.getItem('myName-pp')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('updateMyName', myName)
    }

    this.socket.on('loadTeam', (data) => {
      if (this.teamName == data.teamName && this.organisation == data.organisation) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    this.socket.on('loadOrganisation', (data) => {
      if (this.organisation == data.organisation) {
        this.$store.dispatch('loadOrganisation', data)
      }
    })

    this.socket.on('loadTeams', (data) => {
      if (this.organisation == data.organisation) {
        this.$store.dispatch('loadTeams', data)
      }
    })

    this.socket.on('updateEstimationType', (data) => {
      if (this.teamName == data.teamName && this.organisation == data.organisation) {
        this.$store.dispatch('updateEstimationType', data)
      }
    })

    this.socket.on('updateEstimateTeam', (data) => {
      if (this.organisation == data.organisation) {
        this.$store.dispatch('updateEstimateTeam', data)
      }
    })

    this.socket.on('updateTimer', (data) => {
      if (this.teamName == data.teamName && this.organisation == data.organisation) {
        this.$store.dispatch('updateTimer', data)
      }
    })

    this.socket.on('reveal', (data) => {
      if (this.teamName == data.teamName && this.organisation == data.organisation) {
        this.$store.dispatch('reveal', data)
      }
    })

    this.socket.on('backlogLoaded', (data) => {
      if (this.organisation == data.organisation) {
        alert('Backlog for ' + data.teamName + ' loaded. Backlog now has ' + data.backlogLength + ' items')
        document.getElementById('backlog-file').value = ''
      }
    })

    this.socket.on('backlogSaved', (data) => {
      if (this.organisation == data.organisation) {
        if (data.status) {
          alert('File Saved')
        } else if (data.errType == 'fileExists') {
          if (confirm('File exists, overwrite?')) {
            this.socket.emit('saveBacklog', {organisation: data.organisation, teamName: data.teamName, file: data.file, overwrite: true, separator: data.separator})
          }
        } else {
          alert('Error saving file: ' +  data.err)
        }
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
    height: 40px;
    text-align: center;
  }
  .poker-table {
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
