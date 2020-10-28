<template>
  <table class="results-table">
    <thead>
      <th>Round</th>
      <th>Time</th>
      <th>Value Delivered</th>
      <th>Customer</th>
    </thead>
    <tbody>
      <tr v-for="(round, index) in gameState.rounds" :key="index">
        <td>{{ round.name }}</td>
        <td>{{ time(round.time) }}</td>
        <td>{{ value(round.delivered) }}</td>
        <td>{{ customer(round) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import stringFuns from '../../../lib/stringFuns.js'

export default {
  computed: {
    gameState() {
      return this.$store.getters.getGameState
    },
    currency() {
      return this.$store.getters.getCurrency
    }
  },
  methods: {
    time(secs) {
      return stringFuns.timeString(secs)
    },
    value(n) {
      return stringFuns.htmlDecode(this.currency.major) + stringFuns.valueString(n)
    },
    customer(round) {
      let emoji = ''
      switch(round.name) {
        case 'Batch':
          emoji = '&#128543;'
          break
        case 'Kanban':
          emoji = '&#128529;'
          break
        case 'Value First':
          emoji = '&#128522;'
          break
      }
      return stringFuns.htmlDecode(emoji)
    }
  }
}
</script>

<style lang="scss">

  .results-table {
    font-size: x-large;
    width: 80%;
    margin: 20px auto 32px auto;

    th, td {
      padding: 6px;
      border: 1px solid;
    }
  }
</style>
