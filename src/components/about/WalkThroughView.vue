<template>
  <div>
    <button
      v-if="walkThrough && !showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>
    <modal name="walk-through" id="walk-through" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to Planning Poker</h4>
        <div>
          <p>
            The classic estimation game in an intuitive, easy to use online
            format.
          </p>
          <p>
            You can estimate in any units you wish, and can upload the items you
            want to estimate from a file - and save them back out again to save
            the estimates.
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to Planning Poker</h4>
        <div>
          <p>
            Add <b>host</b> as a URL parameter to see the facilitation tab where you can set units,
            upload and save items, define teams and team members, and more, i.e.
          </p>
          <p>
            <a href="http://agilesimulations.co.uk/planning-poker?host">http://agilesimulations.co.uk/planning-poker?host</a>
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Game Play</h4>
        <p>
          To start, define your organisation by clicking on <b>Set My Organisation</b>.
        </p>
        <p>
          Click <b>Demo Mode?</b> to pre-load a set of teams and a backlog so you can
          play the game to get a feel for it.
        </p>
        <p>
          You can click the <b>Organisation: </b> button at any time to re-initialise the demo.
        </p>
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Play The Game</h4>
        <p>
          To play the game, all players need to enter the same organisation, their name, and
          the same <b>Team Name</b>.
        </p>
        <p>
          The current state of the game will then be updated in real time
          whenever anybody in the game changes anything; just as
          if you were doing it round a table!
        </p>
        <p>
          Enjoy!
        </p>
      </div>
      <div class="buttons" v-if="step < 4">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="skip()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == 4">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import params from '../../lib/params.js'

export default {
  data() {
    return {
      step: 1,
      default: { width: 600, height: 260 },
      positions: {
        2: {  },
        3: {  },
        4: {  },
      }
    }
  },
  computed: {
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    skip() {
      this.step = 8
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  },
}
</script>

<style>
.buttons {
  padding: 6px;
}
#walk-through p {
  margin-left: 8px;
  margin-right: 8px;
}
</style>
