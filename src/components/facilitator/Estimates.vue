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
          <table v-if="team.name == estimateTeam" class="inner-table">
            <tr>
              <td colspan="2">
                <select id="set-estimation-type" @change="setEstimationType()">
                  <option v-for="(estType, eindex) in team.estimationVaues" :key="eindex" :selected="estType == team.estimationType">
                    {{ estType }}
                  </option>
                </select>
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
        <table class="inner-table">
          <tr>
            <td>
              <input id="add-estimation-value" type="text">
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="addEstimationValue()">
                Add Value
              </button>
              <input type="checkbox" id="new-estimation-value-team-only"> This team only?
            </td>
          </tr>
          <tr v-for="(value, index) in estimationValues" :key="index">
            <td>
              {{ value }}
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteEstimationValue(value)">
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
import Team from './backlog/Team.vue'

export default {
  components: {
    Team
  },
  props: [
    'socket'
  ],
  data() {
    return {
      estimateTeam: ''
    }
  },
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
    setEstimationType() {
      const estimationType = document.getElementById('set-estimation-type').value
      this.socket.emit('updateEstimationType', {organisation: this.organisation, teamName: this.estimateTeam, estimationType: estimationType})
    },
    addEstimationType() {
      const estimationType = document.getElementById('new-estimation-type').value
      const thisTeamOnly = document.getElementById('new-estimation-type-team-only').checked
      this.socket.emit('addEstimationType', {organisation: this.organisation, teamName: this.estimateTeam, estimationType: estimationType, thisTeamOnly: thisTeamOnly})
    },
    addEstimationValue() {
      const estimationValue = document.getElementById('add-estimation-value').value
      const thisTeamOnly = document.getElementById('add-estimation-value-team-only').checked
      this.socket.emit('addEstimationValue', {organisation: this.organisation, teamName: this.estimateTeam, estimationType: this.estimationType, value: estimationValue, thisTeamOnly: thisTeamOnly})
    },
    deleteEstimationValue(value) {
      this.socket.emit('deleteEstimationValue', {organisation: this.organisation, teamName: this.estimateTeam, estimationType: this.estimationType, value: value})
    }
  }
}
</script>
