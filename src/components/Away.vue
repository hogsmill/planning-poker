<template>
  <span>
    Away: {{ member.away }}
    <button class="btn btn-sm btn-secondary smaller-font away" :class="{ 'selected': member.away }" @click="setAway()">
      <i class="fas fa-plane-departure" />
    </button>
  </span>
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
      console.log(this.$store.getters.getMember)
      return this.$store.getters.getMember
    }
  },
  methods: {
    setAway() {
      const away = !this.member.away
      bus.$emit('sendUpdateAway', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, away: away})
    }
  }
}
</script>

<style lang="scss">
  .away {
    width: 70px;

    &.selected {
      background-color: green;
    }
  }
</style>
