<template>
  <thead>
    <tr>
      <td :style="{ width: setWidth() }">
        Round
      </td>
      <td v-for="role in gameState.rounds[0]['roles']" :key="role.role" :style="{ width: setWidth() }">
        <span @click="showNameEdit(role.role)"> {{ role.role }} </span>
        <div v-if="roleEditing == role.role">
          <select id="roleSelect" class="form-control" v-model="role.name">
            <option v-for="(player, index) in gameState.players" :key="index">
              {{ player.name }}
            </option>
          </select>
          <button class="btn btn-site-primary mb-2" @click="updateRole(role)">
            &crarr;
          </button>
        </div>
        <span v-if="roleEditing != role.role && role.name"><br> ({{ role.name }}) </span>
      </td>
      <td :style="{ width: setWidth() }">
        Delivered
      </td>
    </tr>
  </thead>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  data() {
    return {
      roleEditing: ''
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    gameState() {
      return this.$store.getters.getGameState
    }
  },
  methods: {
    setWidth() {
      return 100 / (this.gameState.roles.length + 1) + '%'
    },
    showNameEdit(role) {
      this.roleEditing = role
    },
    updateRole(role) {
      this.roleEditing = ''
      const name = document.getElementById('roleSelect').value
      this.socket.emit('updateGameRole', {gameName: this.gameName, role: role, name: name})
    },
  }
}
</script>
