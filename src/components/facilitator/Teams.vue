<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Teams</h4>
        <span v-if="showTeams" @click="setShowTeams(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showTeams" @click="setShowTeams(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <tr v-if="showTeams">
      <td>Add Team</td>
      <td>
        <input type="text" id="add-team-name">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addTeam()">
          Add
        </button>
      </td>
    </tr>
    <tr v-if="showTeams">
      <td>Teams</td>
      <td>
        <table class="inner-table">
          <tr>
            <td class="center">
              Include?
            </td>
            <td colspan="2"></td>
          </tr>
          <tr v-for="(team, index) in teams" :key="index">
            <td>
              <input type="checkbox" :checked="team.include" @click="includeTeam(team)" />
            </td>
            <td>{{ team.name }}</td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteTeam(team)">
                Delete
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    showTeams() {
      return this.$store.getters.getShowTeams
    },
    teams() {
      return this.$store.getters.getTeams
    },
    organisation() {
      return this.$store.getters.getOrganisation
    }
  },
  methods: {
    setShowTeams(val) {
      this.$store.dispatch('setShowTeams', val)
    },
    addTeam() {
      const teamName = document.getElementById('add-team-name').value
      this.socket.emit('addTeam', {organisation: this.organisation, teamName: teamName})
    },
    includeTeam(team) {
      const include = !team.include
      this.socket.emit('includeTeam', {organisation: this.organisation, teamName: team.name, include: include})
    },
    deleteTeam(team) {
      this.socket.emit('deleteTeam', {organisation: this.organisation, teamName: team.name})
    }
  }
}
</script>
