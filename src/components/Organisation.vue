<template>
  <div class="organisation">
    <button class="btn btn-sm btn-secondary smaller-font" v-if="!organisation" @click="show">
      Set My Organisation
    </button>
    <span v-if="organisation" @click="show" class="mr-2 mt-2 pointer p-2 bg-light">Organisation: {{ organisation }}</span>

    <modal name="set-organisation" :height="140" :classes="['rounded', 'set-my-organisation']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>Enter Your Organisation</h4>
        <div class="set-organisation">
          <input type="text" id="organisation" :value="organisation">
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveOrganisation">
            Save
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  props: [
    'socket'
  ],
  computed: {
    teamName() {
      return this.$store.getters.getTeamName
    },
    organisation() {
      return this.$store.getters.getOrganisation
    }
  },
  methods: {
    show() {
      this.$modal.show('set-organisation')
    },
    hide() {
      this.$modal.hide('set-organisation')
    },
    saveOrganisation() {
      const organisation = document.getElementById('organisation').value
      localStorage.setItem('organisation-pp', organisation)
      this.socket.emit('setOrganisation', {organisation: organisation})
      this.hide()
    }
  }
}
</script>

<style lang="scss">
  .organisation {
    display: inline-block;
  }
  .set-organisation {

    #organisation {
      display: inline-block;
      width: 30%;
      margin-right: 6px;
    }
  }
</style>
