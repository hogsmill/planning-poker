<template>
  <div class="train">
    <button class="btn btn-sm btn-secondary smaller-font" @click="startTrain()">
      Start the train!
    </button>
    <div class="commitment" :class="{'over-committed': overCommitted() }">
      Sprint backlog: {{ cardsString(team.committed) }} <span v-if="team.velocity">(Capacity: {{ cardsString(team.velocity) }})</span>
    </div>
    <div class="train-holder">
      <div v-if="!trainRunning" id="train-div">
        <p>
          Start the train, then move it left and right along the ordered<br>
          backlog to define the cards that will form the next sprint backlog.
        </p>
      </div>
      <div v-if="trainRunning" id="train-div" class="train-div">
        <span v-if="trainPosition > 0" class="left">
          <i class="fas fa-arrow-left" @click="left()" />
        </span>
        <div class="the-train" />
        <span v-if="trainPosition < backlog.length" class="right">
          <i class="fas fa-arrow-right" @click="right()" />
        </span>
      </div>
    </div>
    <div class="backlog">
      <div v-for="(card, index) in backlog" :key="index" class="card rounded" :class="cardClass(card)">
        <div class="arrows">
          <i v-if="index > 0" class="fas fa-arrow-left" @click="cardLeft(card)" />
          <i class="fas fa-info-circle" @click="selectCard(card)" />
          <i v-if="index < backlog.length - 1" class="fas fa-arrow-right" @click="cardRight(card)" />
        </div>
        <div class="id">
          Id: {{ card.cardId }} Order: {{ card.order }}
        </div>
        <div class="title">
          {{ card.title }}
        </div>
        <div class="estimate">
          Estimate: {{ card.estimate ? card.estimate.name : 0 }}
        </div>
      </div>
    </div>
    <div v-if="selectedCard" id="card-details" class="card-details rounded">
      <table>
        <tr>
          <td>Id:</td>
          <td>{{ selectedCard.cardId }}</td>
          <td><span v-if="selectedCard.estimate">Estimate:</span></td>
          <td><span v-if="selectedCard.estimate">{{ selectedCard.estimate.name }}</span></td>
        </tr>
        <tr>
          <td>Title:</td>
          <td colspan="3">
            {{ selectedCard.title }}
          </td>
        </tr>
        <tr>
          <td>Description:</td>
          <td colspan="3">
            {{ selectedCard.description }}
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import stringFuns from '../lib/stringFuns.js'

export default {
  data() {
    return {
      trainPosition: 0,
      trainRunning: false,
      selectedCard: false,
    }
  },
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    backlog() {
      return this.$store.getters.getBacklog
    },
    committedCards() {
      return this.$store.getters.getCommittedCards
    },
    estimationType() {
      return this.$store.getters.getEstimationType
    }
  },
  created() {
    this.trainRunning = false
  },
  methods: {
    cardsString(n) {
      let cardStr = ''
      if (this.team.isNumeric) {
        cardStr = n
      } else {
        cardStr = n + ' ' + stringFuns.pluralString(n, 'card')
      }
      return cardStr
    },
    cardClass(card) {
      let classStr = ''
      if (card.overCommitted) {
        classStr = 'over-committed'
      } else if (card.committed) {
        classStr = 'committed'
      }
      return classStr
    },
    overCommitted() {
      return this.team.backlog.find((c) => {
        return c.overCommitted
      })
    },
    commitCard(n, commit) {
      const card = this.team.backlog.find((c) => {
        return c.order == n
      })
      bus.emit('sendCommitCard', {organisationId: this.organisation.id, teamId: this.team.id, cardId: card.id, commit: commit})
    },
    cardLeft(card) {
      bus.emit('sendMoveCard', {organisationId: this.organisation.id, teamId: this.team.id, cardId: card.id, direction: 'left'})
    },
    selectCard(card) {
      this.selectedCard = card
    },
    cardRight(card) {
      bus.emit('sendMoveCard', {organisationId: this.organisation.id, teamId: this.team.id, cardId: card.id, direction: 'right'})
    },
    left() {
      this.commitCard(this.trainPosition, false)
      this.trainPosition = this.trainPosition - 1
      this.positionTrain()
    },
    right() {
      this.trainPosition = this.trainPosition + 1
      this.commitCard(this.trainPosition, true)
      this.positionTrain()
    },
    startTrain() {
      bus.emit('sendStartTrain', {organisationId: this.organisation.id, teamId: this.team.id})
      this.trainPosition = 0
      this.trainRunning = true
      this.positionTrain()
    },
    positionTrain() {
      let pos, left
      if (this.trainPosition == 0) {
        pos = document.getElementsByClassName('card')[this.trainPosition].getBoundingClientRect()
        left = parseInt(pos.left) - 35
      } else if (this.trainPosition == this.backlog.length) {
        pos = document.getElementsByClassName('card')[this.trainPosition - 1].getBoundingClientRect()
        left = parseInt(pos.right) - 100
      } else {
        pos = document.getElementsByClassName('card')[this.trainPosition].getBoundingClientRect()
        left = parseInt(pos.left) - 100
      }
      document.getElementById('train-div').style.display = 'block'
      document.getElementById('train-div').style.left = left + 'px'
    }
  }
}
</script>

<style lang="scss">
  .train {

    .commitment {
      padding: 12px;
      font-weight: bold;
      font-size: xx-large;

      &.over-committed {
        color: red;
      }
    }

    #train-div {
      position: absolute;
    }

    .train-holder {
      height: 70px;

      .the-train {
        width: 70px;
        height: 70px;
        display: inline-block;
        background-image: url("../assets/img/train-black.png");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
      }

      .left, .right {
        font-size: xxx-large;
        padding: 0 6px;
        margin: 0 6px;
        position: relative;
        top: -18px;

        &:hover {
          cursor: pointer;
          color: #444;
        }
      }
      .right {
        margin-right: 0;
      }
    }

    .backlog {
      text-align: left;

      .card {
        width: 150px;
        height: 95px;
        display: inline-block;
        margin: 3px;
        text-align: center;
        border: 1px solid;
        .arrows {
          height: 20px;
          padding: 6px;

          .fas {
            position: absolute;
            color: #bbb;

            &:hover {
              color: #444;
              cursor: pointer;
            }

            &.fa-arrow-left {
              left: 6px;
            }
            &.fa-arrow-right {
              right: 6px;
            }
          }
        }

        .id {
          text-align: right;
          margin-right: 4px;
        }

        .estimate {
          font-weight: bold;
        }

        &.committed {
          background-color: green;
          color: #fff;
        }

        &.over-committed {
          background-color: red;
          color: #fff;
        }

        .title {
          margin: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .backlog-length {
        height: 10px;
        background-color: red;
      }
    }

    .card-details {
      border: 1px solid;
      margin: 40px auto 0 auto;
      width: 400px;
      min-height: 150px;

      td {
        padding: 2px 12px;
        text-align: left;
        vertical-align: top;
      }
    }
  }
</style>
