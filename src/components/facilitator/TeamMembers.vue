<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Team Members</h4>
        <i v-if="showTeamMembers" @click="setShowTeamMembers(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeamMembers" @click="setShowTeamMembers(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showTeamMembers">
      <td>
        Organisation
      </td>
      <td>
        <select id="organisation-select" @change="setSelectedOrganisationId(true)">
          <option> -- Select -- </option>
          <option v-for="(org, oindex) in organisations" :key="oindex" :value="org.id" :selected="org.id == selectedOrganisationId">
            {{ org.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showTeamMembers">
      <td>
        Team
      </td>
      <td>
        <select id="team-select" @change="setSelectedTeamId()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(team, tindex) in teams" :key="tindex" :value="team.id" :selected="team.id == selectedTeamId">
            {{ team.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showTeamMembers">
      <td>
        Add Team Member
      </td>
      <td>
        <input type="text" id="new-team-member">
        <button class="btn btn-sm btn-secondary smaller-font" :disabled="!selectedTeamId || selectedTeam.protected" @click="addTeamMember()">
          Add
        </button>
      </td>
    </tr>
    <tr v-if="showTeamMembers">
      <td>
        Team Members
      </td>
      <td>
        <table>
          <tr v-for="(teamMember, mindex) in selectedTeam.members" :key="mindex">
            <td>
              <input type="checkbox" :checked="teamMember.include" :disabled="selectedTeam.protected" @click="includeTeamMember(teamMember.id)">
            </td>
            <td>
              {{ teamMember.name }}
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="selectedTeam.protected" @click="deleteTeamMember(teamMember.id)">
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
  data() {
    return {
      showTeamMembers: false,
      selectedOrganisationId: null,
      teams: [],
      selectedTeamId: null,
      selectedTeam: {}
    }
  },
  computed: {
    organisations() {
      return this.$store.getters.getOrganisations
    }
  },
  created() {
    this.socket.on('loadOrganisations', (data) => {
      if (this.showTeamMembers) {
        this.setSelectedOrganisationId(false)
        this.setSelectedTeamId()
      }
    })
    this.socket.on('openEditPane', (data) => {
      if (data != 'showTeamMembers') {
        this.showTeamMembers = false
      }
    })
  },
  methods: {
    setShowTeamMembers(val) {
      this.showTeamMembers = val
      if (val) {
        this.socket.emit('openEditPane', 'showTeamMembers')
      }
    },
    setSelectedOrganisationId(clear) {
      if (clear) {
        this.selectedTeamId = null
        this.selectedTeam = {}
      }
      const orgId = document.getElementById('organisation-select').value
      this.selectedOrganisationId = orgId
      const organisation = this.organisations.find(function(o) {
        return o.id == orgId
      })
      this.teams = organisation ? organisation.teams : []
    },
    setSelectedTeamId() {
      const teamId = document.getElementById('team-select').value
      this.selectedTeamId = teamId
      const selectedTeam = this.teams.find(function(t) {
        return t.id == teamId
      })
      this.selectedTeam = selectedTeam ? selectedTeam : {}
    },
    addTeamMember() {
      const name = document.getElementById('new-team-member').value
      this.socket.emit('addTeamMember', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, name: name})
    },
    includeTeamMember(id) {
      this.socket.emit('includeTeamMember', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, id: id})
    },
    deleteTeamMember(id) {
      this.socket.emit('deleteTeamMember', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, id: id})
    }
  }
}
</script>

<style lang="scss">
  .team-members-team {
    width: 260px;
  }
  </style>
