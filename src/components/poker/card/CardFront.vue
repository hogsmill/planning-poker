<template>
  <div class="poker-card rounded">
    <div class="options">
      <i v-if="teamMember.id == member.id" class="coffee fas fa-mug-hot rounded" :class="{ 'selected' : memberStatus() == 'coffee' }" @click="coffee()" />
      <i v-if="teamMember.id == member.id" class="question far fa-question-circle rounded" :class="{ 'selected' : memberStatus() == 'question' }" @click="question()" />
    </div>
    <div v-if="estimating" class="poker-card-value">
      <select v-if="estimationValues != 'numeric' && teamMember.id == member.id" class="estimate-dropdown" :id="'estimate-value-' + teamMember.id" @change="saveEstimate()">
        <option value="" />
        <option v-for="(value, ind) in estimationValues" :key="ind" :value="value.name">
          {{ value.name }}
        </option>
      </select>
      <input v-if="estimationValues == 'numeric' && teamMember.id == member.id" type="text" :id="'estimate-value-' + teamMember.id" @change="saveEstimate()">
      <div v-if="teamMember.id == member.id">
        <i class="fas fa-comment-slash abstain-button" title="abstain" @click="abstain()" />
      </div>
    </div>
    <div v-if="!estimating" class="poker-card-value" @click="startEstimating()">
      <span v-if="!teamMember.estimate && !teamMember.abstain" class="tbd">TBD</span>
      <div v-if="teamMember.estimate && estimationValues == 'numeric'">
        {{ teamMember.estimate }}
      </div>
      <div v-if="teamMember.estimate && estimationValues != 'numeric'">
        <div v-if="teamMember.estimate && teamMember.estimate.icon" class="estimate-icon" :style="{ 'background-image': icon() }" />
        <span v-if="teamMember.estimate && !teamMember.estimate.icon">{{ teamMember.estimate.name }}</span>
        <i v-if="teamMember.abstain" class="fas fa-comment-slash abstained" title="has abstained" />
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../../socket.js'

import memberFuns from '../../../lib/member.js'

export default {
  props: [
    'teamMember'
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
    estimationValues() {
      return this.$store.getters.getEstimationValues
    }
  },
  methods: {
    icon() {
      return 'url("../planning-poker/icons/' + this.teamMember.estimate.icon + '")'
    },
    memberStatus() {
      return memberFuns.status(this.teamMember)
    },
    startEstimating() {
      this.estimating = true
    },
    abstain() {
      bus.$emit('sendMemberAbstain', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.teamMember.id})
    },
    coffee() {
      const val = !(this.memberStatus(this.teamMember) == 'coffee')
      bus.$emit('sendSetMemberValue', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, field: 'coffee', value: val})
    },
    question() {
      const val = !(this.memberStatus(this.teamMember) == 'question')
      bus.$emit('sendSetMemberValue', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.member.id, field: 'question', value: val})
    },
    saveEstimate() {
      const estValue = document.getElementById('estimate-value-' + this.teamMember.id).value
      let estimationValue
      if (this.estimationValues != 'numeric') {
        estimationValue = this.estimationValues.find(function(e) {
          return e.name == estValue
        })
      } else {
        estimationValue = estValue
      }
      bus.$emit('sendUpdateEstimateValue', {organisationId: this.organisation.id, teamId: this.team.id, memberId: this.teamMember.id, value: estimationValue})
      this.estimating = false
    }
  }
}
</script>
