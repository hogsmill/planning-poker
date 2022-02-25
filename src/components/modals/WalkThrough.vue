<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
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
          You can use the game with  own teams, members - even team logos! - by using
          on of our premium packages described
          <a href="https://agilesimulations.co.uk/?pricing">here</a>.
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
        (<i>You can these and set up your own in the premium version</i>)
        <ul>
          <li>Eagle - Fibonacci</li>
          <li>Lion - T-Shirt</li>
          <li>Dragon - Relative</li>
          <li>Gryphen - Fruit</li>
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
  </vue-final-modal>
</template>

<script>
import { $vfm, VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'

import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
  }
</style>
