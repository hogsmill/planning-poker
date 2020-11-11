<template>
  <tr>
    <td>
      Team
    </td>
    <td>
      <select id="estimate-team" @change="setEstimateTeam()">
        <option value="">
          -- Select --
        </option>
        <option v-for="(team, index) in teams" :key="index" :value="team.name" :selected="team.name == estimateTeam">
          {{ team.name }}
        </option>
      </select>
    </td>
  </tr>
</template>

<script>
export default {
  computed: {
    teams() {
      return this.$store.getters.getTeams
    },
    estimateTeam() {
      return this.$store.getters.getEstimateTeam
    },
  },
  methods: {
    setEstimateTeam() {
      const team = document.getElementById('estimate-team').value
      this.$store.dispatch('setEstimateTeam', team)
    }
  }
}
</script>
