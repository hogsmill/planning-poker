<template>
  <span>
    <button class="btn btn-sm btn-secondary smaller-font" @click="show()">Set Game</button>
  </span>
</template>

<script>
export default {
  methods: {
    show() {
      this.$store.dispatch('showModal', 'setGame')
    }
  }
}
</script>
