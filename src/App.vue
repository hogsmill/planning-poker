<template>
  <div id="app" class="mb-4">
    <Header />
    <WalkThroughView />
    <h1>Planning Poker</h1>
    <div v-if="showTab == 'about'">
      <AboutView />
    </div>
    <div v-if="showTab != 'about'">
      <div class="game-params">
        <MyName :socket="socket" />
        <GameName :socket="socket" />
      </div>
      <div class="container">
        <div v-if="showTab == 'facilitator'" :class="{'not-host' : !isHost}">
          <div class="connections">
            Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
          </div>
        </div>
        <div v-if="showTab == 'game'">
          <Poker :socket="socket" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

import params from './lib/params.js'

import Header from './components/Header.vue'
import AboutView from './components/about/AboutView.vue'
import WalkThroughView from './components/about/WalkThroughView.vue'
import MyName from './components/MyName.vue'
import GameName from './components/GameName.vue'
import Poker from './components/Poker.vue'

export default {
  name: 'App',
  components: {
    Header,
    AboutView,
    WalkThroughView,
    MyName,
    GameName,
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
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
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

    if (params.getParam('game')) {
      const game = params.getParam('game')
      this.$store.dispatch('updateGameName', game)
      localStorage.setItem('gameName-cg', game)
    }

    const gameName = localStorage.getItem('gameName-cg')
    if (gameName) {
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName})
    }

    let myName = localStorage.getItem('myName-cg')
    if (myName) {
      myName = JSON.parse(myName)
      this.$store.dispatch('setMyName', myName)
    }

    this.socket.on('updateGameState', (data) => {
      if (this.gameName == data.gameName) {
        this.$store.dispatch('updateGameState', data)
      }
    })

    this.socket.on('updateWorkshopResults', (data) => {
      if (this.workshopName == data.workshopName) {
        this.$store.dispatch('updateWorkshopResults', data)
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
  #clickCoins { margin-left: -2rem; }

  .connections {
    text-align: right;
    margin: 6px
  }

</style>
