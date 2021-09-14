<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font away" title="set my status to 'away'" :class="{ 'selected': member.away }" @click="setAway()">
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
      return this.$store.getters.getMember
    }
  },
  methods: {
    setAway() {
      const away = !this.member.away
      bus.$emit('sendUpdateMemberAttribute', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, field: 'away', value: away, unique: false})
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
