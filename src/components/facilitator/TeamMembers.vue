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
            <td>
              Add team member to {{ teamName }}
            </td><td colspan="2">
              <input type="text">
              <button class="btn btn-sm btn-secondary smaller-font">
                Add
              </button>
            </td>
          </tr>
          <tr>
            <td>Team Members</td>
            <td>
              <table class="inner-table">
                <tr v-for="(teamMember, index) in teamMembers" :key="index">
                  <td><input type="checkbox"></td>
                  <td>{{ teamMember.name }}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary smaller-font" @click="deleteMember(card)">
                      Delete
                    </button>
                  </td>
                </tr>
              </table>
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
    teamName() {
      return this.$store.getters.getTeamName
    },
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
