<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Organisation</h4>
        <i v-if="showOrganisation" @click="setShowOrganisation(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showOrganisation" @click="setShowOrganisation(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showOrganisation">
      <td>
        <input type="text" id="new-organisation">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addOrganisation()">
          Add New
        </button>
      </td>
    </tr>
    <tr v-if="showOrganisation">
      <td>
        <table>
          <tr v-for="(organisation, index) in organisations" :key="index">
            <td>
              <i v-if="organisation.protected" class="fas fa-trash-alt" title="Unable to delete system organisation" />
              <i v-if="!organisation.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + organisation.name" @click="deleteOrganisation(organisation)" />
            </td>
            <td>
              {{ organisation.name }}
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
      showOrganisation: false
    }
  },
  computed: {
    organisations() {
      return this.$store.getters.getOrganisations
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showOrganisation') {
        this.showOrganisation = false
      }
    })
  },
  methods: {
    setShowOrganisation(val) {
      this.showOrganisation = val
      if (val) {
        bus.$emit('openEditPane', 'showOrganisation')
      }
    },
    addOrganisation() {
      const name = document.getElementById('new-organisation').value
      bus.$emit('sendAddOrganisation', {name: name})
    },
    deleteOrganisation(organisation) {
      if (confirm('Delete ' + organisation.name)) {
        bus.$emit('sendDeleteOrganisation', {id: organisation.id})
      }
    }
  }
}
</script>
