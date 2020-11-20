<template>
  <div>
    <div v-for="(team, index) in teams" :key="index">
      <table v-if="team.name == backlogTeam.name">
        <tr v-for="(card, cindex) in team.backlog" :key="cindex">
          <td>{{ card.id }}: {{ card.title }}</td>
          <button class="btn btn-sm btn-secondary smaller-font" @click="deleteCard(card)">
            Delete Card
          </button>
        </tr>
      </table>
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
    teams() {
      return this.$store.getters.getTeams
    },
    backlogTeam() {
      return this.$store.getters.getBacklogTeam
    }
  },
  methods: {
    deleteCard(card) {
      if (confirm('Delete card ' + card.id + ': ' + card.title)) {
        this.socket.emit('deleteBacklogCard', {organisation: this.organisation, teamName: this.backlogTeam.name, card: card})
      }
    }
  }
}
</script>
