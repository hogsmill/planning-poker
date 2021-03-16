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
      <td>
        Organisation
      </td>
      <td>
        <select id="organisation-select" @change="setSelectedOrganisationId()">
          <option> -- Select -- </option>
          <option v-for="(org, oindex) in organisations" :key="oindex" :value="org.id" :selected="org.id == selectedOrganisationId">
            {{ org.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showTeams">
      <td>Add Team</td>
      <td>
        <input type="text" id="new-team">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addTeam()" :disabled="!selectedOrganisationId || selectedOrganisationProtected">
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
              Capacity/Velocity<br>(<i>if using SPs</i>)
            </td>
            <td>
              Estimation Timer?
            </td>
            <td>
              Auto-Reveal?
            </td>
            <td>
              Discussion Timer?
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
              <input type="number" class="velocity" :id="'velocity-' + sanitized(team.name)" :value="team.velocity">
              <i class="fas fa-save" @click="setVelocity(team)" />
            </td>
            <td>
              <input type="checkbox" :checked="team.useEstimationTimer" @click="toggleEstimationTimer(team)">
              <select :id="'estimation-timer-time-' + sanitized(team.name)" class="timer-seconds" :value="team.estimationTimerTime" @change="setEstimationTimerTime(team)" :disabled="!team.useEstimationTimer">
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
            <td class="center">
              <input type="checkbox" :checked="team.timerAutoReveal" @click="toggleTimerAutoReveal(team)">
            </td>
            <td>
              <input type="checkbox" :checked="team.useDiscussionTimer" @click="toggleDiscussionTimer(team)">
              <select :id="'discussion-timer-time-' + sanitized(team.name)" class="timer-seconds" :value="team.discussionTimerTime" @change="setDiscussionTimerTime(team)" :disabled="!team.useDiscussionTimer">
                <option value="30">
                  30s
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
                <option value="180">
                  3:00
                </option>
                <option value="300">
                  5:00
                </option>
                <option value="600">
                  10:00
                </option>
              </select>
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteTeam(team)" :disabled="team.protected">
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
import bus from '../../socket.js'

export default {
  data() {
    return {
      showTeams: false,
      selectedOrganisationId: null,
      selectedOrganisationProtected: false,
      teams: []
    }
  },
  computed: {
    organisations() {
      return this.$store.getters.getOrganisations
    }
  },
  created() {
    bus.$on('loadOrganisations', (data) => {
      if (this.showTeams) {
        this.setSelectedOrganisationId()
      }
    })
    bus.$on('openEditPane', (data) => {
      if (data != 'showTeams') {
        this.showTeams = false
      }
    })
  },
  methods: {
    setShowTeams(val) {
      this.showTeams = val
      if (val) {
        bus.$emit('openEditPane', 'showTeams')
      }
    },
    setSelectedOrganisationId() {
      const orgId = document.getElementById('organisation-select').value
      this.selectedOrganisationId = orgId
      const organisation = this.organisations.find(function(o) {
        return o.id == orgId
      })
      this.teams = organisation ? organisation.teams : []
      this.selectedOrganisationProtected = organisation ? organisation.protected : false
    },
    sanitized(str) {
      return str.replace(/ /g, '').toLowerCase()
    },
    addTeam() {
      const team = document.getElementById('new-team').value
      bus.$emit('sendAddTeam', {organisationId: this.selectedOrganisationId, name: team})
    },
    deleteTeam(team) {
      bus.$emit('sendDeleteTeam', {organisationId: this.selectedOrganisationId, id: team.id})
    },
    includeTeam(team) {
      bus.$emit('sendIncludeTeam', {organisationId: this.selectedOrganisationId, id: team.id})
    },
    toggleDiscussionTimer(team) {
      bus.$emit('sendSetUseDiscussionTimer', {organisationId: this.selectedOrganisationId, id: team.id})
    },
    toggleEstimationTimer(team) {
      bus.e$mit('sendSetUseEstimationTimer', {organisationId: this.selectedOrganisationId, id: team.id})
    },
    toggleTimerAutoReveal(team) {
      bus.$emit('sendSetTimerAutoReveal', {organisationId: this.selectedOrganisationId, id: team.id})
    },
    setVelocity(team) {
      const velocity = document.getElementById('velocity-' + this.sanitized(team.name)).value
      bus.$emit('sendSetVelocity', {organisationId: this.selectedOrganisationId, id: team.id, value: velocity})
    },
    setEstimationTimerTime(team) {
      const timerTime = document.getElementById('estimation-timer-time-' + this.sanitized(team.name)).value
      bus.$emit('sendSetEstimationTimerTime', {organisationId: this.selectedOrganisationId, id: team.id, value: timerTime})
    },
    setDiscussionTimerTime(team) {
      const timerTime = document.getElementById('discussion-timer-time-' + this.sanitized(team.name)).value
      bus.$emit('sendSetDiscussionTimerTime', {organisationId: this.selectedOrganisationId, id: team.id, value: timerTime})
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
