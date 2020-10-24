<template>
  <div class="my-name float-right" v-if="!showAbout">
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
          <input type="text" id="my-name" class="form-control">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveMyName">
            Save
          </button>
        </div>
        <div>I am the facilitator/host <input type="checkbox" id="host"></div>
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
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
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
      const oldName = this.myName
      const newName = document.getElementById('my-name').value
      let myNameData
      if (!oldName.id) {
        const uuid = uuidv4()
        myNameData = {id: uuid, name: newName}
        this.$store.dispatch('setMyName', myNameData)
      } else {
        myNameData = {id: this.myName.id, name: newName}
        this.$store.dispatch('changeName', {name: newName})
        localStorage.setItem('myName-cg', JSON.stringify(myNameData))
        if (this.gameName) {
          this.socket.emit('changeName', {gameName: this.gameName, name: oldName, newName: newName})
        }
      }
      this.socket.emit('addPlayer', {gameName: this.gameName, name: myNameData})
      this.$store.dispatch('updateHost', document.getElementById('host').value)
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
