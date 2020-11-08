<template>
  <tr>
    <td>
      Team
    </td>
    <td>
      <select :id="scope + '-team'" @change="setBacklogTeam()">
        <option value="">
          -- Select --
        </option>
        <option v-for="(team, index) in teams" :key="index" :value="team.name" :selected="team.name == backlogTeam">
          {{ team.name }}
        </option>
      </select>
    </td>
  </tr>
</template>

<script>
export default {
  props: [
    'scope'
  ],
  computed: {
    teams() {
      return this.$store.getters.getTeams
    },
    backlogTeam() {
      return this.$store.getters.getBacklogTeam
    },
  },
  methods: {
    setBacklogTeam() {
      const team = document.getElementById('backlog-team').value
      this.$store.dispatch('setBacklogTeam', team)
    }
  }
}
</script>
