<template>
  <table class="facilitator-table">
    <tr>
      <td>
        <h4>Team Members</h4>
        <span v-if="showTeamMembers" @click="setShowTeamMembers(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showTeamMembers" @click="setShowTeamMembers(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <tr v-if="showTeamMembers">
      <td>
        <table class="inner-table">
          <tr>
            <td>Team</td>
            <td>
              <select id="team-name" v-model="selectedTeam">
                <option value="">
                  -- Select --
                </option>
                <option v-for="(team, index) in teams" :key="index" :value="team.name" :selected="team.name == selectedTeam">
                  {{ team.name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="team-members-team">
              Add team member to {{ selectedTeam }}
            </td><td colspan="2">
              <input type="text" id="add-member-name">
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="!selectedTeam" @click="addTeamMember()">
                Add
              </button>
            </td>
          </tr>
          <tr>
            <td>Team Members</td>
            <td>
              <div v-for="(team, index) in teams" :key="index">
                <table v-if="team.name == selectedTeam" class="inner-table">
                  <tr>
                    <td class="center">
                      Include?
                    </td>
                    <td colspan="2" />
                  </tr>
                  <tr v-for="(teamMember, mindex) in team.members" :key="mindex">
                    <td><input type="checkbox" :checked="teamMember.include" @click="includeTeamMember(team, teamMember)"></td>
                    <td>{{ teamMember.name }}</td>
                    <td>
                      <button class="btn btn-sm btn-secondary smaller-font" @click="deleteTeamMember(teamMember)">
                        Delete
                      </button>
                    </td>
                  </tr>
                </table>
              </div>
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
  data() {
    return {
      selectedTeam: ''
    }
  },
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    showTeamMembers() {
      return this.$store.getters.getShowTeamMembers
    },
    teams() {
      return this.$store.getters.getTeams
    },
    teamMembers() {
      return this.$store.getters.getTeamMembers
    }
  },
  methods: {
    setShowTeamMembers(val) {
      this.$store.dispatch('setShowTeamMembers', val)
    },
    addTeamMember() {
      const memberName = document.getElementById('add-member-name').value
      this.socket.emit('addTeamMember', {organisation: this.organisation, teamName: this.selectedTeam, memberName: memberName})
    },
    includeTeamMember(team, teamMember) {
      const include = !teamMember.include
      this.socket.emit('includeTeamMember', {organisation: this.organisation, teamName: team.name, teamMember: teamMember, include: include})
    },
    deleteTeamMember(teamMember) {
      this.socket.emit('deleteTeamMember', {organisation: this.organisation, teamName: this.selectedTeam, memberName: teamMember.name})
    }
  }
}
</script>

<style lang="scss">
  .team-members-team {
    width: 260px;
  }
  </style>
