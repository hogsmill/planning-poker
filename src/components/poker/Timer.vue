<template>
  <div>
    <div class="timer-holder rounded" :class="{ 'imminent' : imminent() }">
      <div class="timer">{{ displayTimer() }}</div>
      <button v-if="time == 0" class="btn btn-sm btn-secondary smaller-font" @click="startTimer()">
        Start Timer
      </button>
      <button v-if="time > 0" class="btn btn-sm btn-secondary smaller-font" :disable="time > 0" @click="stopTimer()">
        Stop Timer
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    thisTeam() {
      return this.$store.getters.getThisTeam
    },
    time() {
      return this.$store.getters.getTime
    }
  },
  methods: {
    displayTimer() {
      const t = this.time ? this.time : this.thisTeam.timerTime
      let m = parseInt(t / 60)
      let s = t - (m * 60)
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s
      return m + ':' + s
    },
    imminent() {
      return this.time > 0 && this.time < 10
    },
    startTimer() {
      this.socket.emit('startTimer', {organisation: this.organisation, teamName: this.thisTeam.name})
    },
    stopTimer() {
      this.socket.emit('stopTimer', {organisation: this.organisation, teamName: this.thisTeam.name})
    }
  }
}
</script>

<style lang="scss">
  .timer-holder {
    margin: 0 auto 12px auto;
    padding: 12px;
    width: 180px;
    border: 1px solid;

    &.imminent {
      background-color: red;
      color: #fff;
    }

    .timer{
      font-size: 48px;
      font-weight: bold;
    }
  }
</style>
