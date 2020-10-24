<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="http://agilesimulations.co.uk">
      <img src="/lego.png" class="ml-4" height="38px">
    </a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon" />
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{active: showTab == 'game'}">
          <a class="nav-link pointer" @click="updateShowTab('game')">Game</a>
        </li>
        <li v-if="isHost" class="nav-item" :class="{active: showTab == 'facilitator'}">
          <a class="nav-link pointer" @click="updateShowTab('facilitator')">Facilitator</a>
        </li>
        <li class="nav-item" :class="{active: showTab == 'about'}">
          <a class="nav-link pointer" @click="updateShowTab('about')">About</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isHost() {
      return this.$store.getters.getHost
    },
    showTab() {
      return this.$store.getters.getShowTab
    }
  },
  methods: {
    updateShowTab(payload) {
      this.$store.dispatch('updateShowTab', payload)
    }
  }
}
</script>
