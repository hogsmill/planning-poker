<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Estimates</h4>
        <span v-if="showEstimates" @click="setShowEstimates(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showEstimates" @click="setShowEstimates(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <tr v-if="showEstimates">
      <td>
        Estimate Using
      </td>
      <td>
        <select id="set-estimation-type" @change="setEstimationType()">
          <option v-for="(estType, index) in estimationTypes" :key="index" :selected="estType == estimationType">
            {{ estType }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showEstimates">
      <td>
        Estimates Values for {{ estimationType }}
      </td>
      <td>
        <table>
          <tr>
            <td>
              <input id="add-estimation-value" type="text">
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="addEstimationValue()">
                Add Value
              </button>
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
export default {
  props: [
    'socket'
  ],
  computed: {
    showEstimates() {
      return this.$store.getters.getShowEstimates
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    estimationType() {
      return this.$store.getters.getEstimationType
    },
    estimationTypes() {
      return this.$store.getters.getEstimationTypes
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
      this.socket.emit('updateEstimationType', {teamName: this.teamName, estimationType: estimationType})
    },
    addEstimationValue() {
      const estimationValue = document.getElementById('add-estimation-value').value
      this.socket.emit('addEstimationValue', {teamName: this.teamName, estimationType: this.estimationType, value: estimationValue})
    },
    deleteEstimationValue(value) {
      this.socket.emit('deleteEstimationValue', {teamName: this.teamName, estimationType: this.estimationType, value: value})
    }
  }
}
</script>
