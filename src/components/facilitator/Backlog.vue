<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Backlog</h4>
        <span v-if="showBacklog" @click="setShowBacklog(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showBacklog" @click="setShowBacklog(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>
        Load from file<br>
        <i>(Must be CSV, with first 3 columns Id, Title, Description)</i>
      </td>
      <td class="upload">
        <div>
          <input id="backlog-file" type="file" @change="loadBacklog()">
        </div>
        <div>
          Seperator
          <select id="backlog-file-seperator">
            <option value="tab">
              \t (tab)
            </option>
            <option value="comma">
              , (comma)
            </option>
            <option value="space">
              \s (space)
            </option>
          </select>
        </div>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>Add item</td>
      <td class="inner-table">
        <table>
          <tr>
            <td class="inner-table">
              <table class="inner-table">
                <tr>
                  <td>Id</td>
                  <td><input id="card-id" type="text"></td>
                </tr>
                <tr>
                  <td>Title</td>
                  <td><input id="card-title" type="text"></td>
                </tr>
                <tr>
                  <td>Description</td>
                  <td><input id="card-description" type="text"></td>
                </tr>
              </table>
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="addCard()">
                Add Card
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>Delete item</td>
      <td>
        <table>
          <tr v-for="(card, index) in backlog" :key="index">
            <td>{{ card.id }}: {{ card.title }}</td>
            <button class="btn btn-sm btn-secondary smaller-font" @click="deleteCard(card)">
              Delete Card
            </button>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>
        Save as file<br>
      </td>
      <td class="upload">
        TBD
      </td>
    </tr>
  </table>
</template>

<script>
import fileFuns from '../../lib/file.js'

export default {
  props: [
    'socket'
  ],
  computed: {
    showBacklog() {
      return this.$store.getters.getShowBacklog
    },
    teamName() {
      return this.$store.getters.getTeamName
    },
    backlog() {
      return this.$store.getters.getBacklog
    }
  },
  methods: {
    setShowBacklog(val) {
      this.$store.dispatch('setShowBacklog', val)
    },
    loadBacklog() {
      const uploader = document.getElementById('backlog-file')
      const seperator = document.getElementById('backlog-file-seperator').value
      const fr = new FileReader()
      self = this
      fr.onload = function() {
        const backlog = fileFuns.fileToCards(fr.result, seperator)
        self.socket.emit('loadBacklog', {teamName: self.teamName, backlog: backlog})
      }
      fr.readAsText(uploader.files[0])
    },
    addCard() {
      const card = {
        id: document.getElementById('card-id').value,
        selected: false,
        estimate: 0,
        title: document.getElementById('card-title').value,
        description: document.getElementById('card-description').value
      }
      this.socket.emit('addBacklogCard', {teamName: this.teamName, card: card})
    },
    deleteCard(card) {
      if (confirm('Delete card ' + card.id + ': ' + card.title)) {
        this.socket.emit('deleteBacklogCard', {teamName: this.teamName, card: card})
      }

    }
  }
}
</script>
