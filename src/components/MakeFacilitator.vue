<template>
  <button class="btn btn-sm btn-secondary smaller-font make-facilitator" title="Make me Facilitator" :class="{ 'selected': member.facilitator }" @click="makeFacilitator()">
    <i class="fas fa-brain" />
  </button>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    member() {
      return this.$store.getters.getMember
    }
  },
  methods: {
    makeFacilitator() {
      const facilitator = !this.member.facilitator
      bus.$emit('sendUpdateMemberAttribute', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, field: 'facilitator', value: facilitator, unique: true})
    }
  }
}
</script>

<style lang="scss">
  .make-facilitator {
    width: 70px;

    &.selected {
      background-color: green;
    }
  }
</style>
