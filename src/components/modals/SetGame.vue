<template>
  <vue-final-modal name="set-game" classes="modal-container" content-class="vfm__content modal-content set-game" v-model="modals['setGame']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide()" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>Game Set Up</h4>
      <table class="setup-table">

        <!-- Organisation -->

        <tr>
          <td>Organisation: </td>
          <td>
            <select id="organisation-select" @change="setOrganisation()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(org, oindex) in organisations" :key="oindex" :value="org.id" :selected="org.id == organisation.id">
                {{ org.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- Team Name -->

        <tr>
          <td>Team: </td>
          <td>
            <select id="team-select" @change="setTeam()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(t, tindex) in includedTeams" :key="tindex" :value="t.id" :selected="team.id == t.id">
                {{ t.name }}
              </option>
            </select>
          </td>
        </tr>

        <!-- My Name -->

        <tr>
          <td>My Name: </td>
          <td>
            <select id="name-select" @change="setMember()">
              <option value="">
                -- Select --
              </option>
              <option v-for="(name, nindex) in team.members" :key="nindex" :value="name.id" :selected="member.id == name.id">
                {{ name.name }}
              </option>
            </select>
          </td>
        </tr>

      </table>
      <button class="btn btn-sm btn-primary smaller-font" @click="hide()">
        Done
      </button>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

import { $vfm, VueFinalModal } from 'vue-final-modal'

import params from '../../lib/params.js'
import mailFuns from '../../lib/mail.js'

export default {
  components: {
    VueFinalModal
  },
  data() {
    return {
      workshopUrl: '',
      gameUrl: ''
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    organisations() {
      return this.$store.getters.getOrganisations
    },
    organisation() {
      return this.$store.getters.getOrganisation
    },
    team() {
      return this.$store.getters.getTeam
    },
    member() {
      return this.$store.getters.getMember
    },
    includedTeams() {
      return this.$store.getters.getIncludedTeams
    }
  },
  created() {
    this.workshopUrl = params.getParam('workshop')
    this.gameUrl = params.getParam('game')
    if (this.gameUrl) {
      this.workshopUrl = 'None (Single team Game)'
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'setGame')
    },
    setOrganisation() {
      const orgId = document.getElementById('organisation-select').value
      localStorage.setItem('organisation-pp', orgId)
      this.$store.dispatch('updateOrganisation', orgId)
    },
    setTeam() {
      const teamId = document.getElementById('team-select').value
      localStorage.setItem('team-pp', teamId)
      this.$store.dispatch('updateTeam', teamId)
    },
    setMember() {
      const memberId = document.getElementById('name-select').value
      localStorage.setItem('member-pp', memberId)
      this.$store.dispatch('updateMember', memberId)
    }
  }
}
</script>

<style lang="scss">

.setup-table {
  margin: 0 auto 20px auto;

  td {
    height: 45px;

    div {
      padding: 6px;
      text-align: left;

      &.my-name {
      margin-top: 6px;
      margin-bottom: 6px;
      }

      &.my-name-edit {
        padding-bottom: 0;
      }
    }

    &:nth-child(1) {
      padding: 2px 10px;
    }
    &:nth-child(2) {
      width: 200px; ;
    }

    select {
      padding: 0;
    }

    &.button {
      width: 50px;
    }

    .fas {
      color: #888;
      font-size: x-large;

      &:hover {
        cursor: pointer;
        color: #5a6268
      }
    }
  }
}

.error {
  background-color: red;
  color: #fff;
}

</style>
