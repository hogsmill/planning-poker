<template>
  <table v-if="workshopResults.length" class="results-table-multiple">
    <thead>
      <th>Team</th>
      <th v-for="(round, index) in workshopResults[0]" :key="index">
        {{ round.name }}
      </th>
    </thead>
    <tbody>
      <tr v-for="(result, index) in workshopResults" :key="index">
        <td>{{ result[0].gameName }}</td>
        <td><span v-if="result[0].time > 0">{{ value(result[0].delivered) }} in {{ time(result[0].time) }}</span></td>
        <td><span v-if="result[0].time > 0">{{ value(result[1].delivered) }} in {{ time(result[1].time) }}</span></td>
        <td><span v-if="result[0].time > 0">{{ value(result[2].delivered) }} in {{ time(result[2].time) }}</span></td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import stringFuns from '../../../lib/stringFuns.js'

export default {
  computed: {
    workshopResults() {
      return this.$store.getters.getWorkshopResults
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

  .results-table-multiple {
    font-size: large;
    width: 80%;
    margin: 20px auto 32px auto;

    th, td {
      padding: 6px;
      border: 1px solid;
    }
  }
</style>
