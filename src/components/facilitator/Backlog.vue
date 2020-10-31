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
        <i>(Must be CSV, with columns Id, Title, Description, [Estimate])</i> - estimate optional
      </td>
      <td class="upload">
        <div>
          separator
          <select id="backlog-file-separator">
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
        <div>
          <input id="backlog-file-replace" type="checkbox"> Replace existing backlog?
        </div>
        <div>
          <input id="backlog-file" type="file" @change="loadBacklog()">
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
        Save backlog to file
      </td>
      <td class="inner-table">
        <table>
          <tr>
            <td>
              Filename <input id="backlog-save-file" type="text">
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="saveBacklog()">
                Save
              </button>
            </td>
          </tr>
          <tr>
            <td colspan="2">
              separator
              <select id="backlog-save-file-separator">
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
            </td>
          </tr>
        </table>
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
      const file = document.getElementById('backlog-file').files[0]
      const separator = document.getElementById('backlog-file-separator').value
      const replace = document.getElementById('backlog-file-replace').checked
      const backlog = fileFuns.loadBacklog(file, separator, this.teamName, replace, this.socket)
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

    },
    saveBacklog() {
      const saveFile = document.getElementById('backlog-save-file').value
      const separator = document.getElementById('backlog-save-file-separator').value
      this.socket.emit('saveBacklog', {teamName: this.teamName, file: saveFile, backlog: this.backlog, separator: separator})
    }
  }
}
</script>
