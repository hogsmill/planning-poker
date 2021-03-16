<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Estimates</h4>
        <i v-if="showEstimates" @click="setShowEstimates(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showEstimates" @click="setShowEstimates(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showEstimates">
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
    <tr v-if="showEstimates">
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
    <tr v-if="showEstimates && selectedTeamId">
      <td>
        Estimate Using
      </td>
      <td>
        <select id="set-estimation-type" @change="setEstimationType()">
          <option v-for="(estType, eindex) in Object.keys(selectedTeam.estimationValues)" :key="eindex" :selected="estType == selectedTeam.estimationType">
            {{ estType }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showEstimates && selectedTeamId">
      <td />
      <td>
        <input type="text" id="new-estimation-type">
        <button class="btn btn-sm btn-secondary smaller-font" :disabled="selectedTeam.protected" @click="addEstimationType()">
          Add New Estmation Type
        </button>
        <input type="checkbox" id="new-estimation-type-all-teams" :disabled="selectedTeam.protected" checked="true"> Apply to all teams?
      </td>
    </tr>
    <tr v-if="showEstimates && selectedTeamId">
      <td>
        Estimates Values
      </td>
      <td>
        <table v-if="selectedTeamId" class="inner-table">
          <tr>
            <td class="center">
              Include?
            </td>
            <td colspan="2" />
          </tr>
          <tr v-for="(value, index) in selectedTeam.estimationValues[selectedTeam.estimationType]" :key="index">
            <td>
              <input type="checkbox" :checked="value.include" :disabled="selectedTeam.protected" @click="includeValue(value)">
            </td>
            <td>
              <div v-if="value.icon" class="estimate-type-icon" :style="{ 'background-image': logo(value.icon) }" />
              {{ value.name }}
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="selectedTeam.protected" @click="deleteEstimationValue(value)">
                Delete
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <input id="add-estimation-value" type="text">
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="selectedTeam.protected" @click="addEstimationValue()">
                Add Value
              </button>
              <input type="checkbox" id="add-estimation-value-all-teams" :disabled="selectedTeam.protected"> Apply to all teams?
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showEstimates: false,
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
    bus.$on('loadOrganisations', (data) => {
      if (this.showEstimates) {
        this.setSelectedOrganisationId(false)
        this.setSelectedTeamId()
      }
    })
    bus.$on('openEditPane', (data) => {
      if (data != 'showEstimates') {
        this.showEstimates = false
      }
    })
  },
  methods: {
    setShowEstimates(val) {
      this.showEstimates = val
      if (val) {
        bus.$emit('openEditPane', 'showEstimates')
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
    logo(icon) {
      return 'url("../planning-poker/icons/' + icon + '")'
    },
    teamEstimationType() {
      const self = this
      const team = this.teams.find(function(t) {
        return t.name == self.selectedTeam.name
      })
      return team ? team.estimationType : ''
    },
    setEstimationType() {
      const estimationType = document.getElementById('set-estimation-type').value
      bus.$emit('sendUpdateEstimationType', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, estimationType: estimationType})
    },
    addEstimationType() {
      const estimationType = document.getElementById('new-estimation-type').value
      const allTeams = document.getElementById('new-estimation-type-all-teams').checked
      bus.$emit('sendAddEstimationType', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, estimationType: estimationType, allTeams: allTeams})
    },
    addEstimationValue() {
      const estimationType = document.getElementById('set-estimation-type').value
      const estimationValue = document.getElementById('add-estimation-value').value
      const allTeams = document.getElementById('add-estimation-value-all-teams').checked
      bus.$emit('sendAddEstimationValue', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, estimationType: estimationType, value: estimationValue, allTeams: allTeams})
    },
    deleteEstimationValue(value) {
      const estimationType = document.getElementById('set-estimation-type').value
      bus.$emit('sendDeleteEstimationValue', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, estimationType: estimationType, value: value.name})
    }
  }
}
</script>

<style lang="scss">
  .estimate-team-selected {
    display: inline;
  }
  .estimate-type-icon {
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    display: inline-block
  }
</style>
