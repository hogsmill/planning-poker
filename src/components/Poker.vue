<template>
  <div>
    <div class="selected-card">
      <h4 v-if="selectedCard">
        {{ selectedCard.title }}
      </h4>
      <p v-if="selectedCard">
        {{ selectedCard.description }}
      </p>
    </div>
    <div v-if="selectedCard" class="final-estimate">
      <div>
        <span>Agreed Estimate: </span>
        <select id="agreed-estimate-value">
          <option value="" />
          <option v-for="(value, index) in estimationValues" :key="index">
            {{ value }}
          </option>
        </select>
        <button class="btn btn-sm btn-secondary smaller-font" :disabled="!selectedCard" @click="saveAgreedEstimate()">
          Submit
        </button>
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
    <div v-if="selectedCard" class="members">
      <div v-for="(teamMember, index) in teamMembers" :key="index" class="member">
        <div><b>{{ teamMember.name }}</b></div>
        <div v-if="teamMember.id == myName.id || revealed" class="poker-card rounded">
          <div v-if="estimating" class="poker-card-value">
            <select :id="'estimate-value-' + myName.id" @change="saveEstimate()">
              <option value="" />
              <option v-for="(value, ind) in estimationValues" :key="ind">
                {{ value }}
              </option>
            </select>
          </div>
          <div v-if="!estimating" class="poker-card-value" @click="startEstimating()">
            <span v-if="teamMember.estimate">{{ teamMember.estimate }}</span>
            <span v-if="!teamMember.estimate" class="tbd">TBD</span>
          </div>
        </div>
        <div v-if="teamMember.id != myName.id && !revealed" class="poker-card back rounded">
          <div v-if="teamMember.voted" class="poker-card-voted rounded-circle voted">
            &#10004;
          </div>
          <div v-if="!teamMember.voted" class="poker-card-voted rounded-circle not-voted">
            &#10008;
          </div>
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
      estimating: false
    }
  },
  computed: {
    myName() {
      return this.$store.getters.getMyName
    },
    teamName() {
      return this.$store.getters.getTeamName
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
    startEstimating() {
      this.estimating = true
    },
    saveEstimate() {
      const estimationValue = document.getElementById('estimate-value-' + this.myName.id).value
      this.socket.emit('updateEstimateValue', {teamName: this.teamName, teamMember: this.myName, value: estimationValue})
      this.estimating = false
    },
    reveal(value) {
      this.socket.emit('reveal', {teamName: this.teamName, reveal: value})
    },
    saveAgreedEstimate() {
      const estimationValue = document.getElementById('agreed-estimate-value').value
      this.socket.emit('updateAgreedEstimate', {teamName: this.teamName, selectedCard: this.selectedCard, value: estimationValue})
    }
  }
}
</script>

<style lang="scss">
  td {
    padding: 12px;
  }
  .selected-card {
    min-height: 76px;
    border: 1px solid;
    margin-bottom: 24px;
  }
  .estimation-type {
    text-align: right;
    height: 30px;
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
      border: 1px solid;
      margin: 2px;

      select {
        font-size: 20px;
      }

      .poker-card {
        margin: 0 auto;
        height: 144px;
        width: 103px;
        border: 6px solid #888;

        &.back {
          background-image: url("../assets/img/card-back.jpg");
          background-size: contain;
          background-repeat: no-repeat;
          background-position-x: center;
        }
        .tbd {
          color: #ddd;
        }
        .poker-card-value {
          font-size: 40px;
          margin-top: 24px;
          font-weight: bold;
          color: #green;
        }
        .poker-card-voted {
          width: 48px;
          height: 48px;
          background-color: #fff;
          border: 2px solid #888;
          margin: 36px auto 0 auto;
          font-size: 30px;

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
