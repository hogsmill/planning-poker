<template>
  <div>
    <p>
      If you'd like more info, or would like to discuss facilitation, send us your email
      in the box below, and we can discuss your needs.
    </p>
    <div>
      Email: <input type="email" id="email" placeholder="Email address">
      <button class="btn btn-info btn-sm" @click="facilitate()">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import mailFuns from '../../../lib/mail.js'

export default {
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    }
  },
  methods: {
    facilitate() {
      mailFuns.post({
        action: 'Facilitation request (Walkthrough) from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: 'Facilitation Request'
        },
        'Thanks for your request - we\'ll get back to you as soon as we can with details'
      )
    }
  }
}
</script>

<style lang="scss">
  #email {
    width: 50%;
    margin: 6px;
  }
</style>
