<template>
  <span>
    <button v-if="!showAbout" class="btn btn-sm btn-info smaller-font" @click="help()">
      Explain this for me...
    </button>
  </span>
</template>

<script>
import params from '../../lib/params.js'

export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    }
  },
  mounted() {
    if (params.isParam('walkThrough')) {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  },
  methods: {
    help() {
      this.$store.dispatch('showModal', 'walkThrough')
    }
  }
}
</script>

<style lang="scss">
.buttons {
  padding: 6px;
}

#walk-through {
  p {
    margin-left: 12px;
    margin-right: 12px;
  }
  li {
    text-align: left;
  }
  input {
    width: 250px;
    margin-right: 6px;
  }
}
</style>
