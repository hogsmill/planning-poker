<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Teams</h4>
        <i v-if="showTeams" @click="setShowTeams(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeams" @click="setShowTeams(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showTeams">
      <td>Add Team</td>
      <td>
        <input type="text" id="add-team-name">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addTeam()">
          Add
        </button>
      </td>
    </tr>
    <tr v-if="showTeams">
      <td>Teams</td>
      <td>
        <table class="inner-table">
          <tr class="header">
            <td />
            <td class="center">
              Include?
            </td>
            <td>
              Capacity/Velocity (<i>if using SPs</i>)
            </td>
            <td>
              Timer?
            </td>
            <td>
              Auto-Reveal?
            </td>
            <td colspan="2" />
          </tr>
          <tr v-for="(team, index) in teams" class="teams" :key="index">
            <td>
              <b>{{ team.name }}</b>
            </td>
            <td class="center">
              <input type="checkbox" :checked="team.include" @click="includeTeam(team)">
            </td>
            <td class="center">
              <input type="text" class="velocity" :id="'velocity-' + sanitized(team.name)" :value="team.velocity">
              <i class="fas fa-save" @click="setVelocity(team)" />
            </td>
            <td>
              <input type="checkbox" :checked="team.useTimer" @click="toggleTimer(team)">
              <select :id="'timer-time-' + sanitized(team.name)" class="timer-seconds" :value="team.timerTime" @change="setTimerTime(team)" :disabled="!team.useTimer">
                <option value="10">
                  10s
                </option>
                <option value="15">
                  15s
                </option>
                <option value="20">
                  20s
                </option>
                <option value="30">
                  30s
                </option>
                <option value="45">
                  45s
                </option>
                <option value="60">
                  60s
                </option>
                <option value="90">
                  1:30
                </option>
                <option value="120">
                  2:00
                </option>
              </select>
            </td>
            <td>
              <input type="checkbox" :checked="team.timerAutoReveal" @click="toggleTimerAutoReveal(team)">
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteTeam(team)">
                Delete
              </button>
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
    showTeams() {
      return this.$store.getters.getShowTeams
    },
    teams() {
      return this.$store.getters.getTeams
    },
    organisation() {
      return this.$store.getters.getOrganisation
    }
  },
  methods: {
    setShowTeams(val) {
      this.$store.dispatch('setShowTeams', val)
    },
    sanitized(str) {
      return str.replace(/ /g, '').toLowerCase()
    },
    addTeam() {
      const teamName = document.getElementById('add-team-name').value
      this.socket.emit('addTeam', {organisation: this.organisation, teamName: teamName})
    },
    includeTeam(team) {
      const include = !team.include
      this.socket.emit('includeTeam', {organisation: this.organisation, teamName: team.name, include: include})
    },
    toggleTimer(team) {
      const useTimer = !team.useTimer
      this.socket.emit('setUseTimer', {organisation: this.organisation, teamName: team.name, useTimer: useTimer})
    },
    toggleTimerAutoReveal(team) {
      const timerAutoReveal = !team.timerAutoReveal
      this.socket.emit('setTimerAutoReveal', {organisation: this.organisation, teamName: team.name, timerAutoReveal: timerAutoReveal})
    },
    setVelocity(team) {
      const velocity = document.getElementById('velocity-' + this.sanitized(team.name)).value
      console.log(velocity)
      this.socket.emit('setVelocity', {organisation: this.organisation, teamName: team.name, velocity: velocity})
    },
    setTimerTime(team) {
      const timerTime = document.getElementById('timer-time-' + this.sanitized(team.name)).value
      this.socket.emit('setTimerTime', {organisation: this.organisation, teamName: team.name, timerTime: timerTime})
    },
    deleteTeam(team) {
      this.socket.emit('deleteTeam', {organisation: this.organisation, teamName: team.name})
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
  .facilitator-table .teams input[type=checkbox] {
    min-width: 30px;
  }
  .velocity {
    width: 30px;
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
