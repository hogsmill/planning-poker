<template>
  <div>

    <table class="facilitator-teams">
      <tr>
        <td colspan="2">
          <h4>Teams</h4>
          <span v-if="showTeams" @click="setShowTeams(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showTeams" @click="setShowTeams(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showTeams">
        <td>Add Team</td>
        <td><input> <button>Add</button></td>
      </tr>
      <tr v-if="showTeams">
        <td>Teams</td>
        <td></td>
      </tr>
    </table>

    <table class="facilitator-team-members">
      <tr>
        <td>
          <h4>Team Members</h4>
          <span v-if="showTeamMembers" @click="setShowTeamMembers(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showTeamMembers" @click="setShowTeamMembers(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showTeamMembers">
        <td>
          Team Members
        </td>
      </tr>
    </table>

    <table class="facilitator-estimates">
      <tr>
        <td>
          <h4>Estimates</h4>
          <span v-if="showEstimates" @click="setShowEstimates(false)" title="collapse" class="toggle">&#9650;</span>
          <span v-if="!showEstimates" @click="setShowEstimates(true)" title="expand" class="toggle">&#9660;</span>
        </td>
      </tr>
      <tr v-if="showEstimates">
        <td>
          Estimates
        </td>
      </tr>
    </table>

    <table class="facilitator-backlog">
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
              <option value="tab">\t (tab)</option>
              <option value="comma">, (comma)</option>
              <option value="space">\s (space)</option>
            </select>
          </div>
        </td>
      </tr>
      <tr v-if="showBacklog">
        <td>Add item</td>
        <td>
          <table>
            <tr>
              <td>Id</td>
              <td><input id="card-id" type="text" /></td>
            </tr>
            <tr>
              <td>Title</td>
              <td><input id="card-title" type="text" /></td>
            </tr>
            <tr>
              <td>Description</td>
              <td><input id="card-description" type="text" /></td>
            </tr>
            <tr>
              <td colspan="2"><button @click="addCard()">Add Card</button></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import fileFuns from '../lib/file.js'

export default {
  props: [
    'socket'
  ],
  data() {
    return {
      showTeams: false,
      showTeamMembers: false,
      showEstimates: false,
      showBacklog: false
    }
  },
  computed: {
    teamName() {
      return this.$store.getters.getTeamName
    }
  },
  methods: {
    setShowTeams(val) {
      this.showTeams = val
    },
    setShowTeamMembers(val) {
      this.showTeamMembers = val
    },
    setShowEstimates(val) {
      this.showEstimates = val
    },
    setShowBacklog(val) {
      this.showBacklog = val
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
    }
  }
}
</script>

<style lang="scss">
.facilitator-teams, .facilitator-team-members, .facilitator-estimates, .facilitator-backlog {

    width: 90%;
    max-width: 800px;
    margin: 12px auto;
    border: 1px solid #ccc;

    .toggle {
      color: #aaa;
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 50%;
      display: inline-block;
      text-align: left;
    }

    span {
      position: absolute;
      right: 6px;
    }

    td {
      vertical-align: top;
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }

      &.left-col {
        vertical-align: top;
      }

      &.upload {
        div {
          padding: 6px;
          min-width: 300px;
        }
      }
    }
    input {
      width: 70px;
      height: 24px;
      padding: 2px;
      text-align: right;
      margin: 0 auto;
    }
  }
</style>
