<template>
  <button class="btn btn-sm btn-secondary smaller-font" @click="makeFacilitator()">
    Make Me Facilitator
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
      bus.$emit('sendMakeFacilitator', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id})
    }
  }
}
</script>
