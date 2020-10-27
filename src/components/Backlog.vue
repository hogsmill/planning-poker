<template>

  <div>
    <h4>Backlog</h4>
    <table border>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Estimate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(card, index) in backlog" :key="index" @click="selectCard(card.id)">
          <td>{{ card.id }}</td>
          <td>{{ card.title }}</td>
          <td><span v-if="card.estimate">{{ card.estimate }}</span></td>
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
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  methods: {
    selectCard(n) {
      this.$store.dispatch('updateSelectedCard', n)
    }
  }
}
</script>

<style lang="scss">

</style>
