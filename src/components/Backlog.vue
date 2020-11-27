<template>
  <div>
    <h4>Backlog <br>({{ items(backlog.length) }})</h4>
    <p v-if="thisTeam.relativeSizing">
      Drag and drop to relative size items
    </p>
    <draggable v-if="thisTeam.relativeSizing" @start="drag=true" @end="end(backlog)">
      <div v-for="card in backlog" :key="card.id" class="rounded backlog-item" :class="{ 'not-estimated': !card.estimate }" @click="selectCard(card.uid)">
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
              {{ card.rank ? card.rank : card.id }}
            </td>
            <td class="backlog-id" :value="card.id">
              {{ card.id }}
            </td>
            <td class="backlog-title">
              {{ card.title }}
            </td>
            <td class="backlog-estimate">
              <span v-if="card.estimate"><b>{{ card.estimate.name }}</b></span>
            </td>
          </tr>
        </table>
      </div>
    </draggable>
    <div v-if="!thisTeam.relativeSizing">
      <div v-for="(card, index) in backlog" :key="index" class="rounded backlog-item" :class="{ 'not-estimated': !card.estimate }" @click="selectCard(card.uid)">
        <table>
          <tr>
            <td class="backlog-id">
              {{ card.id }}
            </td>
            <td class="backlog-title">
              {{ card.title }}
            </td>
            <td class="backlog-estimate">
              <span v-if="card.estimate"><b>{{ card.estimate.name }}</b></span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  props: [
    'socket'
  ],
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
    }
  },
  methods: {
    items(n) {
      return n == 1 ? '1 item' : n + ' items'
    },
    selectCard(uid) {
      this.socket.emit('selectCard', {organisation: this.organisation, teamName: this.teamName, uid: uid})
    },
    end() {
      // TODO: Massive hack to get this working! :-(
      const newBacklog = []
      let r = 1
      const ranks = document.getElementsByClassName('backlog-id')
      for (let i = 0; i < ranks.length; i++) {
        const rank = ranks[i].getAttribute('value')
        for (let j = 0; j < this.backlog.length; j++) {
          if (this.backlog[j].id == rank) {
            this.backlog[j].rank = r
            r = r + 1
            newBacklog.push(this.backlog[j])
          }
        }
      }
      this.socket.emit('updateBacklog', {organisation: this.organisation, teamName: this.teamName, backlog: newBacklog})
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

  .not-estimated {
    background-color: #eee;
  }
</style>
