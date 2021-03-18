<template>
  <div>
    <div class="timer-holder rounded" :class="{ 'imminent' : imminent() }">
      <table>
        <tr>
          <td>
            <div class="timer">
              {{ displayTimer() }}
            </div>
          </td>
          <td>
            <i v-if="!timerRunning" class="fas fa-play-circle" @click="startTimer()" />
            <i v-if="timerRunning" class="fas fa-stop-circle" @click="stopTimer()" />
          </td>
        </tr>
        <tr v-if="team.useEstimationTimer && team.useDiscussionTimer">
          <td colspan="2">
            <input type="radio" name="timerType" :checked="team.timerType == 'estimation'" @click="setTimerType('estimation')"> Estimation
            <input type="radio" name="timerType" :checked="team.timerType == 'discussion'" @click="setTimerType('discussion')"> Discussion
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    time() {
      return this.$store.getters.getTime
    },
    timerRunning() {
      return this.$store.getters.getTimerRunning
    }
  },
  methods: {
    displayTimer() {
      let t = this.time
      if (!t) {
        t = this.team.timerType == 'estimation' ? this.team.estimationTimerTime : this.team.discussionTimerTime
      }
      let m = parseInt(t / 60)
      let s = t - (m * 60)
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    },
    imminent() {
      return this.time > 0 && this.time < 10
    },
    setTimerType(timerType) {
      bus.$emit('sendSetTimerType', {organisationId: this.organisation.id, teamId: this.team.id, timerType: timerType})
    },
    startTimer() {
      this.$store.dispatch('startTimer')
      bus.$emit('sendStartTimer', {organisationId: this.organisation.id, teamId: this.team.id })
    },
    stopTimer() {
      this.$store.dispatch('stopTimer')
      bus.$emit('sendStopTimer', {organisationId: this.organisation.id, teamId: this.team.id })
    }
  }
}
</script>

<style lang="scss">
  .timer-holder {
    color: #444;
    background-color: #fff;
    margin: 0 auto 12px auto;
    width: 250px;
    box-shadow: 2px 2px 3px #aaa;

    input {
      width: initial;
      margin-left: 6px;
      position: relative;
      top: 1px;
    }

    .fas {
      font-size: xxx-large;
      text-shadow: 2px 2px 2px #aaa;

      &:hover {
        cursor: pointer;
        color: #666;
      }
    }

    &.imminent {
      background-color: red;
      color: #fff;
    }

    .timer {
      width: 140px;
      font-size: 48px;
      font-weight: bold;
      margin: 0 auto;
    }
  }
</style>
