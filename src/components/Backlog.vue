<template>
  <div>
    <h4>Backlog <br>({{ items(backlog.length) }})</h4>
    <p v-if="team.relativeSizing">
      Orderd by estimate (<i>largest at the top</i>)
    </p>
    <div v-if="team.relativeSizing">
      <div v-for="card in backlog" :key="card.id" class="rounded backlog-item" :class="{ 'not-estimated': !card.estimate }" @click="selectCard(card.id)">
        <table>
          <tr class="backlog-item-header">
            <td class="backlog-rank">
              Size order
            </td>
            <td class="backlog-id">
              ID
            </td>
            <td class="backlog-title">
              Title
            </td>
            <td class="backlog-estimate">
              Est.
            </td>
          </tr>
          <tr>
            <td class="backlog-rank">
              {{ card.rank }}
            </td>
            <td class="backlog-id">
              {{ card.cardId }}
            </td>
            <td class="backlog-title">
              {{ card.title }}
            </td>
            <td class="backlog-estimate">
              <div v-if="card.estimate && card.estimate.icon" class="estimate-icon" :style="{ 'background-image': icon(card.estimate) }" />
              <span v-if="card.estimate && !card.estimate.icon"><b>{{ card.estimate.name }}</b></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="!team.relativeSizing">
      <div v-for="(card, index) in backlog" :key="index" class="rounded backlog-item" :class="{ 'not-estimated': !card.estimate }" @click="selectCard(card.id)">
        <table>
          <tr>
            <td class="backlog-id">
              {{ card.id }}
            </td>
            <td class="backlog-title">
              {{ card.title }}
            </td>
            <td class="backlog-estimate">
              <div v-if="card.estimate && card.estimate.icon" class="estimate-icon" :style="{ 'background-image': icon(card.estimate) }" />
              <span v-if="card.estimate && !card.estimate.icon"><b>{{ card.estimate.name }}</b></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  computed: {
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  methods: {
    items(n) {
      return n == 1 ? '1 item' : n + ' items'
    },
    icon(estimate) {
      return 'url("../planning-poker/icons/' + estimate.icon + '")'
    },
    selectCard(id) {
      bus.$emit('sendSelectCard', {organisationId: this.organisation.id, teamId: this.team.id, id: id})
    }
  }
}
</script>

<style lang="scss">
  .backlog-item {
    background-color: #fff;
    color: #222;
    margin: 12px auto;
    box-shadow: 2px 2px 3px #aaa;
    width: 75%;

    &:nth-of-type(1) {
      width: 100%;
    }
    &:nth-of-type(2) {
      width: 95%;
    }
    &:nth-of-type(3) {
      width: 90%;
    }
    &:nth-of-type(4) {
      width: 85%;
    }
    &:nth-of-type(5) {
      width: 80%;
    }

    td {
      padding: 6px;
    }
    .backlog-rank {
      width: 10%;
    }
    .backlog-estimate {
      width: 10%;
    }
  }

  .estimate-icon {
    width: 35px;
    height: 35px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .not-estimated {
    background-color: #eee;
  }
</style>
