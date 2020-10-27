<template>
  <div class="team-name float-right">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!teamName" @click="show">
      Set Team Name
    </button>
    <span v-if="teamName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Team: {{ teamName }}</span>

    <modal name="set-team-name" :height="240" :classes="['rounded', 'set-team-name']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>
          Team Name
        </h4>
        <div class="set-team-name">
          <select id="team-name">
            <option value="">
              -- Select --
            </option>
            <option v-for="(team, index) in teams" :key="index" :value="team.name" :selected="team.name == teamName">
              {{ team.name }}
            </option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveTeamName">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
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
    teams() {
      return this.$store.getters.getTeams
    }
  },
  methods: {
    show() {
      this.$modal.show('set-team-name')
    },
    hide() {
      this.$modal.hide('set-team-name')
    },
    saveTeamName() {
      const teamName = document.getElementById('team-name').value
      localStorage.setItem('teamName-pp', teamName)
      this.$store.dispatch('updateTeamName', teamName)
      this.socket.emit('loadTeam', {teamName: teamName})
      this.hide()
    }
  },
}
</script>

<style lang="scss">

  .set-team-name {

    #team-name {
      display: inline-block;
      width: 30%;
      margin-right: 6px;
    }
  }

</style>
