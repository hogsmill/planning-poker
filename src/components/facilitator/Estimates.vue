<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Estimates (TBD)</h4>
        <span v-if="showEstimates" @click="setShowEstimates(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showEstimates" @click="setShowEstimates(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <Team v-if="showEstimates" :scope="'estimate'"/>
    <tr v-if="showEstimates">
      <td>
        Estimate Using
      </td>
      <td>
        <div v-for="(team, index) in teams" :key="index">
          <table v-if="team.name == estimateTeam.name" class="inner-table">
            <tr>
              <td colspan="2">
                <select id="set-estimation-type" @change="setEstimationType()">
                  <option v-for="(estType, eindex) in Object.keys(team.estimationValues)" :key="eindex" :selected="estType == team.estimationType">
                    {{ estType }}
                  </option>
                </select>
                <div class="estimate-team-selected" v-if="estimateTeam"> for {{ estimateTeam.name }} </div>
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" id="new-estimation-type">
              </td>
              <td>
                <button class="btn btn-sm btn-secondary smaller-font" @click="addEstimationType()">
                  Add New
                </button>
                <input type="checkbox" id="new-estimation-type-team-only"> This team only?
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr v-if="showEstimates">
      <td>
        Estimates Values for {{ estimationType }}
      </td>
      <td>
        <table v-if="estimateTeam" class="inner-table">
        <tr>
          <td class="center">
            Include?
          </td>
          <td colspan="2"></td>
          <tr v-for="(value, index) in estimateTeam.estimationValues[estimateTeam.estimationType]" :key="index">
            <td><input type="checkbox" :checked="value.include" @click="includeValue(value)"></td>
            <td>
            <div v-if="value.icon" class="estimate-type-icon" :style="{ 'background-image': logo(value.icon) }" />
              {{ value.name }}
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteEstimationValue(value)">
                Delete
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <input id="add-estimation-value" type="text">
              <button class="btn btn-sm btn-secondary smaller-font" @click="addEstimationValue()">
                Add Value
              </button>
              <input type="checkbox" id="new-estimation-value-team-only"> This team only?
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import Team from './estimates/Team.vue'

export default {
  components: {
    Team
  },
  props: [
    'socket'
  ],
  computed: {
    showEstimates() {
      return this.$store.getters.getShowEstimates
    },
    organisation() {
      return this.$store.getters.getOrganisation
    },
    teams() {
      return this.$store.getters.getTeams
    },
    estimateTeam() {
      return this.$store.getters.getEstimateTeam
    },
    estimationType() {
      return this.$store.getters.getEstimationType
    },
    estimationValues() {
      return this.$store.getters.getEstimationValues
    }
  },
  methods: {
    setShowEstimates(val) {
      this.$store.dispatch('setShowEstimates', val)
    },
    logo(icon) {
      return 'url("../planning-poker/icons/' + icon + '")'
    },
    teamEstimationType() {
      const self = this
      const team = this.teams.find(function(t) {
        return t.name == self.estimateTeam.name
      })
      return team ? team.estimationType : ''
    },
    setEstimationType() {
      const estimationType = document.getElementById('set-estimation-type').value
      this.socket.emit('updateEstimationType', {organisation: this.organisation, teamName: this.estimateTeam.name, estimationType: estimationType})
    },
    addEstimationType() {
      const estimationType = document.getElementById('new-estimation-type').value
      const thisTeamOnly = document.getElementById('new-estimation-type-team-only').checked
      this.socket.emit('addEstimationType', {organisation: this.organisation, teamName: this.estimateTeam.name, estimationType: estimationType, thisTeamOnly: thisTeamOnly})
    },
    addEstimationValue() {
      const estimationValue = document.getElementById('add-estimation-value').value
      const thisTeamOnly = document.getElementById('add-estimation-value-team-only').checked
      this.socket.emit('addEstimationValue', {organisation: this.organisation, teamName: this.estimateTeam.name, estimationType: this.estimationType, value: estimationValue, thisTeamOnly: thisTeamOnly})
    },
    deleteEstimationValue(value) {
      this.socket.emit('deleteEstimationValue', {organisation: this.organisation, teamName: this.estimateTeam.name, estimationType: this.estimationType, value: value})
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
  }
</style>
