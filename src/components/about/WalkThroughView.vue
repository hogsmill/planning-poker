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
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            This simulation shows the importance of focussing on value delivery
            as the best means of satisfying customer need, and the best strategy
            for reducing risk
          </p>
          <div class="coin-game-round" />
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to the Coin Game</h4>
        <div>
          <p>
            Project work is simulated - in the real game - by the flipping of
            coins, and the flow of work in a project is simulated by passing the
            coins from role to role - e.g. from a designer to a dev, to a QA and
            finally delivery to the customer. (<em>yes, we know teams should be cross-functional and no roles, but
              this is just for the simulation...</em>)
          </p>
          <p>In the online version, coins are played by merely clicking them</p>
          <p>
            The value delivered is the actual value of coins passed to the
            customer
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Round 1: Batch Delivery</h4>
        <p>
          In this round, all coins must be played by a role before being passed
          on <em>en masse</em>. This simulates a batch, or waterfall approach.
          The round stops after {{ gameState.timeLimit.click }} seconds, and it is
          extremely unlikely that any value will reach the customer in this time.
        </p>
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Round 2: Kanban Delivery</h4>
        <p>
          In this round, coins are passed on as soon as they are clicked. This
          is to simulate more of a Kanban or flow way of working
        </p>
        <p>
          There is no time limit on this round, but note the time it takes to
          deliver all the coins to the customer
        </p>
      </div>
      <div class="mt-4" v-if="step == 5">
        <h4>Round 3: Value Delivery</h4>
        <p>
          This round is also kanban (coins passed on immediately), but the timer
          stops <em>after {{ gameState.valueTimeLimit.click }} seconds!</em>. Coins are click highest-value first,
          however, and the amount of value delivered is recorded.
        </p>
        <p>
          Typically, despite having only one sixth of the time of round 1, most
          of the value - usually 80% to 85% - will be delivered. This will also
          typically be in 50% or less of the time of round 2, so most of the
          value is delivered in much less time.
        </p>
        <p>This is the light bulb moment...</p>
      </div>
      <div class="mt-4" v-if="step == 6">
        <h4>Game Play</h4>
        <p>
          Click the 'Play' buttons to play each round of the game as you would
          round a table; everybody's browser will update as the coins are
          clicked, so the next role can click coins as soon as they are
          available to be played
        </p>
        <p>
          The game can also be run in demo mode; if you're presenting to
          management or C-Suite, or doing an online presentation (<em>not currently available</em>)
        </p>
      </div>
      <div class="mt-4" v-if="step == 7">
        <h4>Game Play</h4>
        <p>
          Click on the role in the header of this table to add the real names of
          people playing the game, so you can see who's moving coins, and chivvy
          them along accordingly...
        </p>
      </div>
      <div class="mt-4" v-if="step == 8">
        <h4>Play The Game</h4>
        <p>
          To play the game, all players need to set the same <b>Game Name</b>.
        </p>
        <p>
          The current state of the game will then be updated in real time
          whenever a coin is clicked so you can play the game as interactively as
          if you were doing it round a table!
        </p>
        <p>
          Enjoy!
        </p>
      </div>
      <div class="buttons" v-if="step < 8">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="skip()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == 8">
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
        2: { height: 290 },
        3: { target: 'batch-button', width: 400, height: 240 },
        4: { target: 'kanban-button', width: 400, height: 255 },
        5: { target: 'value-delivery-button', width: 400, height: 380 },
        6: { width: 400, height: 300 },
        7: { target: 'results-table-body', width: 600, height: 180 },
        8: { width: 600, height: 280 }
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
