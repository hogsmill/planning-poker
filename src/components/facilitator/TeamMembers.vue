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
        <table>
          <tr>
            <td colspan="2">
              <input type="text"> <button>Add Team Member</button>
            </td>
          </tr>
          <tr v-for="(teamMember, index) in teamMembers" :key="index">
            <td><input type="checkbox"></td>
            <td>{{ teamMember.name }}</td>
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
    showTeamMembers() {
      return this.$store.getters.getShowTeamMembers
    },
    teamMembers() {
      return this.$store.getters.getTeamMembers
    }
  },
  methods: {
    setShowTeamMembers(val) {
      this.$store.dispatch('setShowTeamMembers', val)
    }
  }
}
</script>
