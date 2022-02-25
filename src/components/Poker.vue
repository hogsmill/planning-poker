<template>
  <div>
    <div v-if="!selectedCard" class="select-card">
      Click a backlog card to start estimating
    </div>
    <div v-if="selectedCard">
      <div class="selected-card">
        <h4>
          {{ selectedCard.title }}
        </h4>
        <p v-if="selectedCard">
          {{ selectedCard.description }}
        </p>
      </div>
      <div class="final-estimate">
        <Timer v-if="team.useDiscussionTimer || team.useEstimationTimer" />
        <div v-if="organisation.showEstimationType">
          (Estimating using: {{ team.estimationType }})
        </div>
        <div v-if="controller" class="agreed-estimate">
          <span>Agreed Estimate: </span>
          <select v-if="estimationValues != 'numeric'" id="agreed-estimate-value">
            <option value="" />
            <option v-for="(value, index) in estimationValues" :key="index" :value="value.name">
              {{ value.name }}
            </option>
          </select>
          <input v-if="estimationValues == 'numeric'" type="text" id="agreed-estimate-value">
          <button class="btn btn-sm btn-secondary smaller-font" :disabled="!selectedCard" @click="saveAgreedEstimate()">
            Submit
          </button>
          <div id="team-logo" :style="{ 'background-image': logo() }" />
        </div>
        <div v-if="revealed">
          Lowest: {{ lowest() }},
          <span v-if="numeric()">Mean: {{ mean() }}</span>
          <span v-if="!numeric()">Median: {{ median() }}</span>
          , Highest {{ highest() }}
        </div>
        <div>
          <button v-if="controller" class="btn btn-sm btn-secondary smaller-font reveal" :disabled="revealed" @click="reEstimate(true)">
            Re-Estimate Card
          </button>
          <button v-if="controller && !revealed" class="btn btn-sm btn-secondary smaller-font reveal" @click="reveal(true)">
            Reveal Estimates
          </button>
          <button v-if="controller && revealed" class="btn btn-sm btn-secondary smaller-font reveal" @click="reveal(false)">
            Hide Estimates
          </button>
        </div>
      </div>
      <div class="members">
        <div
          v-for="(teamMember, index) in teamMembers" :key="index" class="member rounded"
          :class="{ 'median': revealed && !numeric() && isMedian(teamMember), 'mean': revealed && numeric() && isMean(teamMember), 'highest': revealed && isHighest(teamMember), 'lowest':revealed && isLowest(teamMember) }"
        >
          <div><b>{{ teamMember.name }}</b></div>
          <CardFront v-if="teamMember.id == member.id || revealed" :team-member="teamMember" />
          <CardBack v-if="teamMember.id != member.id && !revealed" :team-member="teamMember" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import memberFuns from '../lib/member.js'

import Timer from './poker/Timer.vue'
import CardFront from './poker/card/CardFront.vue'
import CardBack from './poker/card/CardBack.vue'

export default {
  components: {
    Timer,
    CardFront,
    CardBack
  },
  data() {
    return {
      estimating: false
    }
  },
  computed: {
    controller() {
      return this.$store.getters.getController
    },
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    member() {
      return this.$store.getters.getMember
    },
    selectedCard() {
      return this.$store.getters.getSelectedCard
    },
    teamMembers() {
      return this.$store.getters.getTeamMembers
    },
    estimationValues() {
      return this.$store.getters.getEstimationValues
    },
    revealed() {
      return this.$store.getters.getRevealed
    }
  },
  methods: {
    logo() {
      if (this.team.id && this.team.logo) {
        return 'url("../planning-poker/icons/' + this.team.logo + '")'
      }
    },
    numeric() {
      return this.team.estimationValues[this.team.estimationType] == 'numeric'
    },
    estimateVal(estimate) {
      return this.numeric() ? estimate : estimate.name
    },
    isHighest(member) {
      return member.voted && !member.abstain && this.estimateVal(member.estimate) == this.team.highest
    },
    isLowest(member) {
      return member.voted && !member.abstain && this.estimateVal(member.estimate) == this.team.lowest
    },
    isMedian(member) {
      return member.voted && !member.abstain && this.estimateVal(member.estimate) == this.team.median
    },
    isMean(member) {
      return member.voted && !member.abstain && this.estimateVal(member.estimate) == this.team.mean
    },
    lowest() {
      return this.team.lowest
    },
    highest() {
      return this.team.highest
    },
    median() {
      return this.team.median
    },
    mean() {
      return this.team.mean
    },
    reveal(value) {
      bus.emit('sendReveal', {organisationId: this.organisation.id, teamId: this.team.id, reveal: value})
    },
    reEstimate() {
      this.reveal(false)
      bus.emit('sendReEstimate', {organisationId: this.organisation.id, teamId: this.team.id})
    },
    saveAgreedEstimate() {
      const estValue = document.getElementById('agreed-estimate-value').value
      let estimationValue
      if (this.estimationValues != 'numeric') {
        estimationValue = this.estimationValues.find(function(e) {
          return e.name == estValue
        })
      } else {
        estimationValue = estValue
      }
      bus.emit('sendUpdateAgreedEstimate', {organisationId: this.organisation.id, teamId: this.team.id, selectedCard: this.selectedCard, value: estimationValue})
    }
  }
}
</script>

<style lang="scss">
  td {
    padding: 12px;
  }
  .select-card {
    margin: 120px 24px 0 24px;
    font-size: xxx-large;

  }
  .selected-card {
    padding-top: 12px;
    color: #444;
    background-color: #fff;
    min-height: 76px;
    margin-bottom: 24px;
    box-shadow: 2px 2px 3px #aaa;
  }
  #team-logo {
    height: 65px;
    width: 65px;
    float: right;
    position: relative;
    top: -10px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .estimation-type {
    text-align: right;
    height: 30px;
  }
  .estimate-dropdown option {
    padding-left: 30px;
  }
  .agreed-estimate {
    padding: 12px;
    span, select {
      font-size: x-large;
    }
    button {
      position: relative;
      top: -4px;
    }
  }
  .final-estimate {
    div {
      margin-bottom: 6px;

      button {
        margin: 0 4px;

        &.reveal {
          width: 130px;
        }
      }
    }
  }
  .members {

    .member {
      width: 140px;
      height: 200px;
      float: left;
      margin: 2px;

      &.highest {
        background-color: red;
      }

      &.lowest {
        background-color: green;
      }

      &.median, &.mean {
        background-color: orange;
      }

      select {
        font-size: 20px;
      }

      .poker-card {
        background-color: #fff;
        margin: 0 auto;
        height: 144px;
        width: 103px;
        border: 6px solid #888;
        box-shadow: 2px 2px 3px #aaa;
        position: relative;

        .abstain-button {
          font-size: 16px;
          position: relative;
          top: -32px;
        }

        .coffee {
          position: absolute;
          left: 3px;
          top: 3px;
          padding: 3px;

          &.selected {
            color: #fff;
            background-color: green;
          }
        }

        .question {
          position: absolute;
          right: 3px;
          top: 3px;
          padding: 3px;

          &.selected {
            color: #fff;
            background-color: green;
          }
        }

        .options {
          color: #888;

          i:hover {
            cursor: pointer;
            color: #444;
          }
        }

        &.back {
          background-image: url("../assets/img/card-back.png");
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          background-color: #888;
        }

        .tbd, .abstained {
          color: #aaa;
        }

        .estimate-icon {
          width: 50px;
          height: 50px;
          margin: 40px auto;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .poker-card-value {
          margin-top: 24px;
          font-size: 40px;
          font-weight: bold;
          color: #444;

          &:hover {
            cursor: pointer;
          }
        }
        .poker-card-voted {
          width: 45px;
          height: 45px;
          background-color: #fff;
          border: 2px solid #888;
          margin: 36px auto 0 auto;
          font-size: 30px;

          .coffee-status {
            color: #444;
            position: relative;
            top: -2px;
            left: 2px;
          }

          .away-status {
            font-size: 28px;
            color: #444;
          }

          .question-status {
            color: #444;
          }

          &.voted {
            color: green;
          }

          &.not-voted {
            color: red;
          }

          &.abstain {

            .fa-comment-slash {
              color: #444;
              font-size: 24px;
              top: -3px;
              position: relative;
            }
          }
        }
      }
    }
  }
</style>
