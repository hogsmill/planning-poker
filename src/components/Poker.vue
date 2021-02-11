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
        <Timer v-if="team.useDiscussionTimer || team.useEstimationTimer" :socket="socket" />
        <div class="agreed-estimate">
          <span>Agreed Estimate: </span>
          <select id="agreed-estimate-value">
            <option value="" />
            <option v-for="(value, index) in estimationValues" :key="index" :value="value.name">
              {{ value.name }}
            </option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" :disabled="!selectedCard" @click="saveAgreedEstimate()">
            Submit
          </button>
          <div id="team-logo" :style="{ 'background-image': logo() }" />
        </div>
        <div v-if="revealed">
          Lowest: {{ lowest() }}, Median: {{ median() }}, Highest {{ highest() }}
        </div>
        <div>
          <button v-if="!revealed" class="btn btn-sm btn-secondary smaller-font reveal" @click="reveal(true)">
            Reveal Estimates
          </button>
          <button v-if="revealed" class="btn btn-sm btn-secondary smaller-font reveal" @click="reveal(false)">
            Hide Estimates
          </button>
        </div>
      </div>
      <div class="members">
        <div v-for="(teamMember, index) in teamMembers" :key="index" class="member rounded"
             :class="{ 'median': isMedian(teamMember), 'highest': isHighest(teamMember), 'lowest': isLowest(teamMember) }">
          <div><b>{{ teamMember.name }}</b></div>
          <div v-if="teamMember.id == member.id || revealed" class="poker-card rounded">
            <div class="options">
              <i v-if="teamMember.id == member.id" class="coffee fas fa-mug-hot rounded" :class="{ 'selected' : memberStatus(teamMember) == 'coffee' }" @click="coffee(teamMember)" />
              <i v-if="teamMember.id == member.id" class="question far fa-question-circle rounded" :class="{ 'selected' : memberStatus(teamMember) == 'question' }" @click="question(teamMember)" />
            </div>
            <div v-if="estimating" class="poker-card-value">
              <select v-if="teamMember.id == member.id" class="estimate-dropdown" :id="'estimate-value-' + member.id" @change="saveEstimate()">
                <option value="" />
                <option v-for="(value, ind) in estimationValues" :key="ind" :value="value.name">
                  {{ value.name }}
                </option>
              </select>
            </div>
            <div v-if="!estimating" class="poker-card-value" @click="startEstimating()">
              <div v-if="teamMember.estimate && teamMember.estimate.icon" class="estimate-icon" :style="{ 'background-image': icon(teamMember.estimate) }" />
              <span v-if="teamMember.estimate && !teamMember.estimate.icon">{{ teamMember.estimate.name }}</span>
              <span v-if="!teamMember.estimate" class="tbd">TBD</span>
            </div>
          </div>
          <div v-if="teamMember.id != member.id && !revealed" class="poker-card back rounded">
            <div v-if="memberStatus(teamMember) == 'coffee'" class="poker-card-voted rounded-circle">
              <i class="coffee-status fas fa-mug-hot" />
            </div>
            <div v-if="memberStatus(teamMember) == 'question'" class="poker-card-voted rounded-circle">
              <i class="question-status far fa-question-circle" />
            </div>
            <div v-if="memberStatus(teamMember) == 'voted'" class="poker-card-voted rounded-circle voted">
              <i class="fas fa-check-circle" />
            </div>
            <div v-if="memberStatus(teamMember) == 'not-voted'" class="poker-card-voted rounded-circle not-voted">
              <i class="fas fa-times-circle" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Timer from './poker/Timer.vue'

export default {
  components: {
    Timer
  },
  props: [
    'socket'
  ],
  data() {
    return {
      estimating: false
    }
  },
  computed: {
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
    icon(estimate) {
      return 'url("../planning-poker/icons/' + estimate.icon + '")'
    },
    isHighest(member) {
      return member.voted && member.estimate.name == this.team.highest
    },
    isLowest(member) {
      return  member.voted && member.estimate.name == this.team.lowest
    },
    isMedian(member) {
      return  member.voted && member.estimate.name == this.team.median
    },
    memberStatus(member) {
      let status = ''
      if (member.coffee) {
        status = 'coffee'
      } else if (member.question) {
        status = 'question'
      } else if (member.voted) {
        status = 'voted'
      } else {
        status = 'not-voted'
      }
      return status
    },
    startEstimating() {
      this.estimating = true
    },
    coffee(member) {
      this.socket.emit('memberCoffee', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, coffee: true})
    },
    question(member) {
      this.socket.emit('memberQuestion', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, question: true})
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
    saveEstimate() {
      const estValue = document.getElementById('estimate-value-' + this.member.id).value
      const estimationValue = this.estimationValues.find(function(e) {
        return e.name == estValue
      })
      this.socket.emit('updateEstimateValue', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, value: estimationValue})
      this.estimating = false
    },
    reveal(value) {
      this.socket.emit('reveal', {organisationId: this.organisation.id, teamId: this.team.id, reveal: value})
    },
    saveAgreedEstimate() {
      const estValue = document.getElementById('agreed-estimate-value').value
      const estimationValue = this.estimationValues.find(function(e) {
        return e.name == estValue
      })
      this.socket.emit('updateAgreedEstimate', {organisationId: this.organisation.id, teamId: this.team.id, selectedCard: this.selectedCard, value: estimationValue})
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

      &.median {
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
        .tbd {
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
          font-size: 40px;
          margin-top: 24px;
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

          .question-status {
            color: #444;
          }

          &.voted {
            color: green;
          }

          &.not-voted {
            color: red;
          }
        }
      }
    }
  }
</style>
