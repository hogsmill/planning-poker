<template>
  <div class="my-name float-right">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!myName" @click="show">
      Set My Name
    </button>
    <span v-if="myName" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">I am: {{ myName.name }}</span>

    <modal name="set-my-name" :height="140" :classes="['rounded', 'set-my-name']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Name</h4>
        <div class="set-my-name">
          <select id="my-name">
            <option value=""> -- Select -- </option>
            <option v-for="(teamMember, index) in teamMembers" :key="index" :value="teamMember.id" :selected="myName.id == teamMember.id">{{ teamMember.name }}</option>
          </select>
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

export default {
  props: [
    'socket'
  ],
  computed: {
    teamName() {
      return this.$store.getters.getTeamName
    },
    teamMembers() {
      return this.$store.getters.getTeamMembers
    },
    myName() {
      return this.$store.getters.getMyName
    }
  },
  methods: {
    show () {
      this.$modal.show('set-my-name')
    },
    hide () {
      this.$modal.hide('set-my-name')
    },
    saveMyName: function() {
      const id = document.getElementById('my-name').value
      const name = this.teamMembers.find(function(m) {
        return m.id == id
      })
      console.log(name)
      this.$store.dispatch('updateMyName', name)
      localStorage.setItem('myName-pp', JSON.stringify(name))
      //if (this.teamName) {
      //  this.socket.emit('changeName', {teamName: this.teamName, name: oldName, newName: newName})
      //}
      this.hide()
    }
  }
}
</script>

<style lang="scss">

.set-my-name {

  #my-name {
    display: inline-block;
    width: 30%;
    margin-right: 6px;
  }
}
</style>
