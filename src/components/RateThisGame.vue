<template>
  <div class="game-rate">
    <i class="far fa-star rate-game" title="Rate This Game" @click="rateThisGame()" />
    <div class="rate-select" :class="{'visible': showRateSelect}">
      <i v-for="(n, index) in 5" :key="index" :class="rateClass(n)" @mouseover="rating(n)" @click="setRating(n)" />
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  data() {
    return {
      showRateSelect: false,
      current: 0
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    }
  },
  methods: {
    rateThisGame() {
      this.showRateSelect = !this.showRateSelect
    },
    rateClass(n) {
      let str = n > this.current ? 'far' : 'fas'
      str = str + ' fa-star '
      str = str + 'rating-' + n
      return str
    },
    rating(n) {
      this.current = n
    },
    setRating(n) {
      alert('Thank you for rating ' + this.thisGame)
      this.showRateSelect = false
      bus.$emit('sendRating', {game: this.thisGame, rating: n})
    }
  }
}
</script>

<style lang="scss">
  .game-rate {
    position: relative;

    .rate-game {
      float: right;
      margin-right: 6px;
      color: #888;

      &:hover {
        color: #444;
        cursor: pointer;
      }
    }

    .rate-select {
      visibility: hidden;
      position: absolute;
      top: 0;
      right: 0;
      background-color: #fff;
      border: 1px solid #888;
      top: 12px;
      right: 50px;
      box-shadow: 1px 1px 4px #ccc;

      i {
        color: goldenrod;
      }
    }
  }
</style>
