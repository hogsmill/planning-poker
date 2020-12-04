<template>
  <div class="game-view">
    <div class="label">
      View:
    </div>
    <div class="view-button rounded" :class="{ 'selected' : gameView == 'poker'}">
      <div class="poker" @click="setGameView('poker')" />
    </div>
    <div class="view-button rounded" :class="{ 'selected' : gameView == 'train'}">
      <div class="train" @click="setGameView('train')" />
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    gameView() {
      return this.$store.getters.getGameView
    }
  },
  methods: {
    setGameView(view) {
      console.log(view)
      this.socket.emit('setGameView', {organisation: this.organisation, teamName: this.teamName, view: view})
    }
  }
}
</script>

<style lang="scss">
  .game-view {
    display: inline-block;
    width: 180px;

    .label {
      display: inline-block;
      width: 40px;
      height: 30px;
    }

    .view-button {
      display: inline-block;
      margin: 0 4px;
      padding: 4px;
      width: 60px;
      height: 30px;
      border: 1px solid #bbb;
      position: relative;
      top: 11px;

      &:hover {
        cursor: pointer;
      }

      &.selected {
        background-color: #f8f9fa;
      }

      div {
        width: 40px;
        height: 20px;
        margin: auto auto;

        &.poker {
          background-image: url("../assets/img/poker.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        &.train {
          background-image: url("../assets/img/train.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
      }
    }
  }
</style>
