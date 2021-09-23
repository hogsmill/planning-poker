<template>
  <div class="poker-card back rounded">
    <div v-if="memberStatus() == 'away'" class="poker-card-voted rounded-circle" away>
      <i class="away-status fas fa-plane-departure" title="away" />
    </div>
    <div v-if="memberStatus() == 'coffee'" class="poker-card-voted rounded-circle">
      <i class="coffee-status fas fa-mug-hot" title="requested coffee break" />
    </div>
    <div v-if="memberStatus() == 'question'" class="poker-card-voted rounded-circle">
      <i class="question-status far fa-question-circle" title="wants to ask a question" />
    </div>
    <div v-if="memberStatus() == 'voted'" class="poker-card-voted rounded-circle voted">
      <i class="fas fa-check-circle" title="has voted" />
    </div>
    <div v-if="memberStatus() == 'not-voted'" class="poker-card-voted rounded-circle not-voted">
      <i class="fas fa-times-circle" title="has not voted" />
    </div>
    <div v-if="memberStatus() == 'abstain'" class="poker-card-voted rounded-circle abstain">
      <i class="fas fa-comment-slash" title="has abstained" />
    </div>
  </div>
</template>

<script>
import memberFuns from '../../../lib/member.js'

export default {
  props: [
    'teamMember'
  ],
  methods: {
    memberStatus() {
      return memberFuns.status(this.teamMember)
    }
  }
}
</script>
