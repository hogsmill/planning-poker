<template>
  <div>
    <h4>Backlog <br>({{ items(backlog.length) }})</h4>
    <table v-if="backlog.length" border>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Estimate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(card, index) in backlog" :key="index" @click="selectCard(card.uid)">
          <td>{{ card.id }}</td>
          <td>{{ card.title }}</td>
          <td><span v-if="card.estimate"><b>{{ card.estimate }}</b></span></td>
        </tr>
      </tbody>
    </table>
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
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  methods: {
    items(n) {
      return n == 1 ? '1 item' : n + ' items'
    },
    selectCard(uid) {
      this.socket.emit('selectCard', {organisation: this.organisation, teamName: this.teamName, uid: uid})
    }
  }
}
</script>

<style lang="scss">

</style>
