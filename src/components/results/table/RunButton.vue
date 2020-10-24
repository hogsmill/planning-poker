<template>
  <button :id="round.name + '-button'" class="btn btn-site-primary mb-2" @click="go(index)">
    Run {{ round.name }}
  </button>
</template>

<script>
export default {
  props: [
    'socket',
    'round',
    'index'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    go(round) {
      this.socket.emit('startRound', {gameName: this.gameName, round: round})
    }
  }
}
</script>
