<template>
  <div class="train">
    <button class="btn btn-sm btn-secondary smaller-font" @click="positionTrain()">
      Start the train!
    </button>
    <div v-if="isNumeric(estimationType)" class="commitment">
      Commitment: {{ selectedTotal() }}
    </div>
    <div class="train-holder">
      <div id="train-div" class="train-div">
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
      <div v-for="(card, index) in backlog" :key="index" class="card rounded" :class="{ 'selected' : index < trainPosition }">
        <div class="id">
          Id: {{ card.id }}
        </div>
        <div class="title">
          {{ card.title }}
        </div>
        <div class="estimate">
          Estimate: {{ card.estimate ? card.estimate.name : 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      trainPosition: 0
    }
  },
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    thisTeam() {
      return this.$store.getters.getThisTeam
    },
    backlog() {
      return this.$store.getters.getBacklog
    },
    estimationType() {
      return this.$store.getters.getEstimationType
    }
  },
  methods: {
    isNumeric(estimationType) {
      return estimationType == 'fibonacci'
    },
    selectedTotal() {
      let total = 0, i
      const cards = []
      for (i = 0; i < this.trainPosition; i++) {
        const card = this.backlog[i]
        card.selected = true
        cards.push(card)
        const estimate = this.backlog[i].estimate ? parseInt(this.backlog[i].estimate.name) : 0
        total = total + estimate
      }
      for (let j = i; j < this.backlog.length; j++) {
        const card = this.backlog[j]
        card.selected = false
        cards.push(card)
      }
      this.socket.emit('updateCommittedCards', {organisation: this.organisation, teamName: this.teamName, backlog: cards})
      return total
    },
    left() {
      this.trainPosition = this.trainPosition - 1
      this.positionTrain()
    },
    right() {
      this.trainPosition = this.trainPosition + 1
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
    }

    #train-div {
      position: absolute;
      display: none;
    }

    .train-holder {
      height: 70px;

      .the-train {
        width: 70px;
        height: 70px;
        display: inline-block;
        background-image: url("../assets/img/train.png");
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
        height: 70px;
        display: inline-block;
        margin: 3px;
        text-align: center;
        border: 1px solid;

        .id {
          text-align: right;
          margin-right: 4px;
        }

        .estimate {
          font-weight: bold;
        }

        &.selected {
          background-color: green;
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
  }
</style>
