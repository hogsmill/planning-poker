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
      <td><input> <button>Add</button></td>
    </tr>
    <tr v-if="showTeams">
      <td>Teams</td>
      <td />
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
    }
  },
  methods: {
    setShowTeams(val) {
      this.$store.dispatch('setShowTeams', val)
    }
  }
}
</script>
