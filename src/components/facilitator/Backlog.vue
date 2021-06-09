<template>
  <table class="facilitator-table">
    <tr>
      <td colspan="2">
        <h4>Backlog</h4>
        <i v-if="showBacklog" @click="setShowBacklog(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showBacklog" @click="setShowBacklog(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>
        Organisation
      </td>
      <td>
        <select id="organisation-select" @change="setSelectedOrganisationId(true)">
          <option value="">
            -- Select --
          </option>
          <option v-for="(org, oindex) in organisations" :key="oindex" :value="org.id" :selected="org.id == selectedOrganisationId">
            {{ org.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showBacklog">
      <td>
        Team
      </td>
      <td>
        <select id="team-select" @change="setSelectedTeamId()">
          <option value="">
            -- Select --
          </option>
          <option v-for="(team, tindex) in teams" :key="tindex" :value="team.id" :selected="team.id == selectedTeamId">
            {{ team.name }}
          </option>
        </select>
      </td>
    </tr>
    <tr v-if="showBacklog && selectedTeamId">
      <td>
        Relative sizing?
      </td>
      <td>
        <input id="relative-sizing" type="checkbox" :checked="selectedTeam.relativeSizing" @change="toggleRelativeSizing()">
      </td>
    </tr>
    <tr v-if="showBacklog && selectedTeamId">
      <td>
        Load from file<br>
        <i>(Must be CSV, with columns Id, Title, <br>Description, [Estimate])</i> - estimate optional
      </td>
      <td class="upload">
        <table class="inner-table">
          <Delimiter :scope="'load'" />
          <tr>
            <td>
              <input id="backlog-file-replace" type="checkbox">
              Replace existing backlog?
            </td>
          </tr>
          <tr>
            <td>
              <input id="backlog-file" type="file">
            </td>
          </tr>
          <tr>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="loadBacklog()">
                Load
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog && selectedTeamId">
      <td>
        Add item
      </td>
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
              <button class="btn btn-sm btn-secondary smaller-font" @click="addCard()">
                Add Card
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog && selectedTeamId">
      <td>
        Delete item
      </td>
      <td>
        <table>
          <tr v-for="(card, cindex) in selectedTeam.backlog" :key="cindex">
            <td>
              {{ card.cardId }}: {{ card.title }}
            </td>
            <td>
              <button class="btn btn-sm btn-secondary smaller-font" @click="deleteCard(card)">
                Delete Card
              </button>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr v-if="showBacklog && selectedTeamId">
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
              <button class="btn btn-sm btn-secondary smaller-font" @click="saveBacklog()">
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
import bus from '../../socket.js'

import fileFuns from '../../lib/file.js'

import Delimiter from './backlog/Delimiter.vue'

export default {
  components: {
    Delimiter
  },
  data() {
    return {
      showBacklog: false,
      selectedOrganisationId: null,
      teams: [],
      selectedTeamId: null,
      selectedTeam: {}
    }
  },
  computed: {
    organisations() {
      return this.$store.getters.getOrganisations
    }
  },
  created() {
    bus.$on('loadOrganisations', (data) => {
      if (this.showBacklog) {
        this.setSelectedOrganisationId(false)
        this.setSelectedTeamId()
      }
    })
    bus.$on('openEditPane', (data) => {
      if (data != 'showBacklog') {
        this.showBacklog = false
      }
    })
    bus.$on('backlogLoaded', (data) => {
      if (this.selectedOrganisationId == data.organisationId) {
        alert('Backlog for ' + data.teamName + ' loaded. Backlog now has ' + data.backlogLength + ' items')
        document.getElementById('backlog-file').value = ''
      }
    })
    bus.$on('backlogSaved', (data) => {
      if (this.selectedOrganisationId == data.organisationId) {
        if (data.status) {
          alert('File Saved')
        } else if (data.errType == 'fileExists') {
          if (confirm('File exists, overwrite?')) {
            bus.$emit('sendSaveBacklog', {organisationId: data.organisationId, teamId: data.teamId, file: data.file, overwrite: true, separator: data.separator})
          }
        } else {
          alert('Error saving file: ' +  data.err)
        }
      }
    })

  },
  methods: {
    setShowBacklog(val) {
      this.showBacklog = val
      if (val) {
        bus.$emit('sendOpenEditPane', 'showBacklog')
      }
    },
    setSelectedOrganisationId(clear) {
      if (clear) {
        this.selectedTeamId = null
        this.selectedTeam = {}
      }
      const orgId = document.getElementById('organisation-select').value
      this.selectedOrganisationId = orgId
      const organisation = this.organisations.find(function(o) {
        return o.id == orgId
      })
      this.teams = organisation ? organisation.teams : []
    },
    setSelectedTeamId() {
      const teamId = document.getElementById('team-select').value
      this.selectedTeamId = teamId
      const selectedTeam = this.teams.find(function(t) {
        return t.id == teamId
      })
      this.selectedTeam = selectedTeam ? selectedTeam : {}
    },
    toggleRelativeSizing() {
      const sizing = document.getElementById('relative-sizing').checked
      bus.$emit('sendSetRelativeSizing', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, relativeSizing: sizing})
    },
    loadBacklog() {
      const file = document.getElementById('backlog-file').files[0]
      const separator = document.getElementById('backlog-load-file-separator').value
      const replace = document.getElementById('backlog-file-replace').checked
      fileFuns.loadBacklog(file, separator, this.selectedOrganisationId, this.selectedTeamId, replace)
    },
    addCard() {
      const card = {
        cardId: document.getElementById('card-id').value,
        title: document.getElementById('card-title').value,
        description: document.getElementById('card-description').value
      }
      bus.$emit('sendAddBacklogCard', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, card: card})
    },
    deleteCard(card) {
      if (confirm('Delete card ' + card.cardId + ': ' + card.title)) {
        bus.$emit('sendDeleteBacklogCard', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, id: card.id})
      }
    },
    saveBacklog() {
      const saveFile = document.getElementById('backlog-save-file').value
      const separator = document.getElementById('backlog-save-file-separator').value
      bus.$emit('sendSaveBacklog', {organisationId: this.selectedOrganisationId, teamId: this.selectedTeamId, file: saveFile, separator: separator})
    }
  }
}
</script>

<style lang="scss">
  input[type=file] {
    width: 200px;
  }
</style>
