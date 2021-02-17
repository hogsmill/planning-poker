<template>
  <span>
    <button v-if="!showAbout" class="btn btn-sm btn-info smaller-font" @click="help()">
      Explain this for me...
    </button>

    <modal name="walk-through" id="walk-through" :height="350" :classes="['rounded']">
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
          <Facilitation />
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to Planning Poker</h4>
        <div>
          <p>
            To start, click <b>Set Game</b> and select the organisation, team and
            your name. All players need to choose the same organisation and team to
            play the same game.
          </p>
          <p>
            Either select the pre-defined Demo data to explore the game, or you can set up
            your own teams (<i>see next screen</i>)
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Welcome to Planning Poker</h4>
        <div>
          <p>
            Add <b>host</b> as a URL parameter to see the facilitation tab where you can
            add teams and players, set units, upload and save items, define teams and team
            members, and much more, i.e.
          </p>
          <p>
            <a href="https://agilesimulations.co.uk/planning-poker?host">https://agilesimulations.co.uk/planning-poker?host</a>
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Playing The Game</h4>
        <div>
          <p>
            Click on a backlog card to get started. Each player can estimate privately, then
            the facilitator, or one team member, can reveal the estimates once everyone has
            estimated. An agreed estimate can then be entered.
          </p>
          <p>
            The current state of the game will be updated in real time
            whenever anybody in the game changes anything; just as
            if you were doing it round a table!
          </p>
          <p>
            Enjoy!
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 5">
        <h4>Game Views</h4>
        <p>
          There are 2 views in the game - the default estimation screen and
          "The Train". The train is a fun way to order the backlog and work
          out a sensible next sprit backlog.
        </p>
      </div>
      <div class="mt-4" v-if="step == 6">
        <h4>Demo Mode</h4>
        <p>
          Demo mode allows you to explore the features of the app; 4 teams are pre-defined, and
          each one has a different default way to estimate
          (<i>You can set up your own in the Facilitator tab</i>)
          <ul>
            <li>Eagle - Fibonacci</li>
            <li>Lion - T-Shirt</li>
            <li>Dragon - Relative</li>
            <li>Gryphen Fruit</li>
          </ul>
        </p>
      </div>
      <div class="buttons" v-if="step < 6">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="skip()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == 6">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </span>
</template>

<script>
import params from '../../lib/params.js'

import Facilitation from './Facilitation.vue'

export default {
  components: {
    Facilitation
  },
  data() {
    return {
      step: 1,
      default: { width: 600, height: 380 },
      positions: {
        2: {  },
        3: {  },
        4: { height: 350 },
      }
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
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
      this.step = 6
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
  }
}
</script>

<style lang="scss">
.buttons {
  padding: 6px;
}

#walk-through {
  p {
    margin-left: 12px;
    margin-right: 12px;
  }
  li {
    text-align: left;
  }
  input {
    width: 250px;
    margin-right: 6px;
  }
}
</style>
