<template>
  <div class="game-name float-right" v-if="!showAbout">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!gameName && !workshop" @click="show">
      Set Game Name
    </button>
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!gameName && workshop" @click="show">
      Set Team Name
    </button>
    <span v-if="workshopName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Workshop: {{ workshopName }}</span>
    <span v-if="gameName && !workshop" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Game: {{ gameName }}</span>
    <span v-if="gameName && workshop" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Team: {{ gameName }}</span>
    <span v-if="gameName" title="Restart Game" class="restart" @click="restartGame">&#8635;</span>

    <modal name="set-game-name" :height="240" :classes="['rounded', 'set-game-name']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <div><input type="checkbox" :checked="workshop" @click="toggleWorkshop()"> Multi-team game?</div>
        <h4 v-if="workshop">
          Enter The Workshop Name
        </h4>
        <div v-if="workshop" class="set-game-name">
          <input type="text" id="workshop-name" class="form-control" :value="workshopName">
        </div>
      </div>
      <div class="mt-4">
        <h4 v-if="!workshop">
          Enter Your Game Name
        </h4>
        <h4 v-if="workshop">
          Enter Your Team Name
        </h4>
        <div class="set-game-name">
          <input type="text" id="game-name" class="form-control" :value="gameName">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveGameName">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    workshop() {
      return this.$store.getters.getWorkshop
    },
    workshopName() {
      return this.$store.getters.getWorkshopName
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    show() {
      this.$modal.show('set-game-name')
    },
    hide() {
      this.$modal.hide('set-game-name')
    },
    toggleWorkshop() {
      this.$store.dispatch('updateWorkshop', !this.workshop)
    },
    saveWorkshopName() {
      const workshopName = document.getElementById('workshop-name').value
      localStorage.setItem('workshopName-cg', workshopName)
      this.$store.dispatch('updateWorkshopName', workshopName)
      this.hide()
    },
    saveGameName() {
      let workshopName = ''
      if (document.getElementById('workshop-name')) {
        workshopName = document.getElementById('workshop-name').value
        localStorage.setItem('workshopName-cg', workshopName)
        this.$store.dispatch('updateWorkshopName', workshopName)
      }
      const gameName = document.getElementById('game-name').value
      localStorage.setItem('gameName-cg', gameName)
      this.$store.dispatch('updateGameName', gameName)
      this.socket.emit('loadGame', {gameName: gameName, workshopName: workshopName})
      this.hide()
    },
    restartGame() {
      const restartGame = confirm('Are you sure you want to re-start this game?')
      if (restartGame) {
        this.socket.emit('restartGame', {gameName: this.gameName})
      }
    }
  },
}
</script>

<style lang="scss">

.restart {
  margin-right: 12px;
}

.set-game-name {

  #game-name, #workshop-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
