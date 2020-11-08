<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Backlog</h4>
        <span v-if="showBacklog" @click="setShowBacklog(false)" title="collapse" class="toggle">&#9650;</span>
        <span v-if="!showBacklog" @click="setShowBacklog(true)" title="expand" class="toggle">&#9660;</span>
      </td>
    </tr>
    <Team v-if="showBacklog" :scope="'backlog'"/>
    <tr v-if="showBacklog">
      <td>
        Load from file<br>
        <i>(Must be CSV, with columns Id, Title, <br>Description, [Estimate])</i> - estimate optional
      </td>
      <td class="upload">
        <table class="inner-table">
          <Delimiter :scope="'load'" />
          <tr>
            <td colspan>
              <input id="backlog-file-replace" type="checkbox">
            </td>
            <td>
              Replace existing backlog?
            </td>
          </tr>
          <tr>
            <td>
              <input id="backlog-file" type="file" :disabled="!backlogTeam" @change="loadBacklog()">
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>Add item</td>
      <td>
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
          <tr>
            <td colspan="2">
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="!backlogTeam" @click="addCard()">
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
        <TeamBacklog :socket="socket" />
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>
        Save backlog to file
      </td>
      <td class="inner-table">
        <table>
          <Delimiter :scope="'save'" />
          <tr>
            <td colspan="2">
              Filename <input id="backlog-save-file" type="text">
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" :disabled="!backlogTeam" @click="saveBacklog()">
                Save
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import fileFuns from '../../lib/file.js'

import Delimiter from './backlog/Delimiter.vue'
import Team from './backlog/Team.vue'
import TeamBacklog from './backlog/TeamBacklog.vue'

export default {
  components: {
    Team,
    TeamBacklog,
    Delimiter
  },
  props: [
    'socket'
  ],
  computed: {
    showBacklog() {
      return this.$store.getters.getShowBacklog
    },
    backlogTeam() {
      return this.$store.getters.getBacklogTeam
    },
    teams() {
      return this.$store.getters.getTeams
    },
    organisation() {
      return this.$store.getters.getOrganisation
    }
  },
  methods: {
    setShowBacklog(val) {
      this.$store.dispatch('setShowBacklog', val)
    },
    loadBacklog() {
      const file = document.getElementById('backlog-file').files[0]
      const separator = document.getElementById('backlog-load-file-separator').value
      const replace = document.getElementById('backlog-file-replace').checked
      fileFuns.loadBacklog(file, separator, this.organisation, this.backlogTeam, replace, this.socket)
    },
    addCard() {
      const card = {
        id: document.getElementById('card-id').value,
        selected: false,
        estimate: 0,
        title: document.getElementById('card-title').value,
        description: document.getElementById('card-description').value
      }
      this.socket.emit('addBacklogCard', {organisation: this.organisation, teamName: this.backlogTeam, card: card})
    },
    saveBacklog() {
      const saveFile = document.getElementById('backlog-save-file').value
      const separator = document.getElementById('backlog-save-file-separator').value
      this.socket.emit('saveBacklog', {organisation: this.organisation, teamName: this.backlogTeam, file: saveFile, separator: separator})
    }
  }
}
</script>
