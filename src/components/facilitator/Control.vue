<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Control</h4>
        <i v-if="showControl" @click="setShowControl(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showControl" @click="setShowControl(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showControl">
      <td>
        Organisation
      </td>
      <td>
        <select id="organisation-select" @change="setSelectedOrganisation()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(org, oindex) in organisations" :key="oindex" :value="org.id" :selected="selectedOrganisation && org.id == selectedOrganisation.id">
            {{ org.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showControl && selectedOrganisation">
      <td>
        Show Estimation Type
      </td>
      <td colspan="2">
        <input type="checkbox" :checked="selectedOrganisation && selectedOrganisation.showEstimationType" @click="updateShowEstimationType()">
      </td>
    </tr>
    <tr v-if="showControl && selectedOrganisation">
      <td>
        Only Admin Can Control
      </td>
      <td colspan="2">
        <input type="checkbox" :checked="selectedOrganisation && selectedOrganisation.onlyAdminCanControl" @click="updateOnlyAdminCanControl()">
      </td>
    </tr>
    <tr v-if="showControl && selectedOrganisation">
      <td>
        Facilitator Controls
      </td>
      <td colspan="2">
        <input type="checkbox" :checked="selectedOrganisation && selectedOrganisation.facilitatorControls" @click="updateFacilitatorControls()">
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      showControl: false,
      selectedOrganisation: null
    }
  },
  computed: {
    organisations() {
      return this.$store.getters.getOrganisations
    }
  },
  created() {
    bus.on('loadOrganisations', (data) => {
      if (this.showControl) {
        this.setSelectedOrganisation()
      }
    })
  },
  methods: {
    setShowControl(val) {
      this.showControl = val
      if (val) {
        bus.emit('openEditPane', 'showControl')
      }
    },
    setSelectedOrganisation() {
      const orgId = document.getElementById('organisation-select').value
      this.selectedOrganisation = this.organisations.find(function(o) {
        return o.id == orgId
      })
    },
    updateShowEstimationType() {
      const showEstimationType = !this.selectedOrganisation.onlyAdminCanControl
      bus.emit('sendUpdateControl', {organisationId: this.selectedOrganisation.id, field: 'showEstimationType', value: showEstimationType})
    },
    updateOnlyAdminCanControl() {
      const onlyAdminCanControl = !this.selectedOrganisation.onlyAdminCanControl
      bus.emit('sendUpdateControl', {organisationId: this.selectedOrganisation.id, field: 'onlyAdminCanControl', value: onlyAdminCanControl})
    },
    updateFacilitatorControls() {
      const facilitatorControls = !this.selectedOrganisation.facilitatorControls
      bus.emit('sendUpdateControl', {organisationId: this.selectedOrganisation.id, field: 'facilitatorControls', value: facilitatorControls})
    }
  }
}
</script>

<style lang="scss">
  .facilitator-table select.timer-seconds {
    width: 60px !important;
    min-width: 60px !important;
    position: relative;
    top: -7px;
  }
  .facilitator-table .header td,  .facilitator-table td.center, {
    text-align: center;
  }
  .fa-save {
    color: #aaa;
    font-size: x-large;
    margin-left: 6px;
    position: relative;
    top: 3px;

    &:hover {
      cursor: pointer;
      color: #444;
    }
  }
</style>
