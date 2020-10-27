<template>
  <div id="app" class="mb-4">
    <Header />
    <WalkThroughView />
    <h1>Planning Poker</h1>
    <div>
      <div class="game-params">
        <MyName :socket="socket" />
        <TeamName :socket="socket" />
      </div>
      <div class="container">
        <div>
          <div class="connections">
            Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
          </div>
        </div>
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
import MyName from './components/MyName.vue'
import TeamName from './components/TeamName.vue'
import Backlog from './components/Backlog.vue'
import Poker from './components/Poker.vue'

export default {
  name: 'App',
  components: {
    Header,
    WalkThroughView,
    MyName,
    TeamName,
    Backlog,
    Poker
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
    teamName() {
      return this.$store.getters.getTeamName
    },
    connections() {
      return this.$store.getters.getConnections
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

    const teamName = localStorage.getItem('teamName-pp')
    if (teamName) {
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {teamName: teamName})
    }

    let myName = localStorage.getItem('myName-pp')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('updateMyName', myName)
    }

    this.socket.on('loadTeam', (data) => {
      if (this.teamName == data.teamName) {
        this.$store.dispatch('loadTeam', data)
      }
    })

    this.socket.on('updateEstimationType', (data) => {
      if (this.teamName == data.teamName) {
        this.$store.dispatch('updateEstimationType', data)
      }
    })

    this.socket.on('reveal', (data) => {
      if (this.teamName == data.teamName) {
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
    height: 40px;
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
