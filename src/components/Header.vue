<template>
  <nav class="navbar navbar-expand-lg navbar-light mb-4">
    <a class="navbar-brand" href="https://agilesimulations.co.uk">
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
      <h1>
        {{ appName }}
      </h1>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item" :class="{active: showTab == 'game'}">
          <a class="nav-link pointer" @click="updateShowTab('game')">Game</a>
        </li>
        <li v-if="admin" class="nav-item" :class="{active: showTab == 'facilitator'}">
          <a class="nav-link pointer" @click="updateShowTab('facilitator')">Facilitator</a>
        </li>
        <li class="nav-item" :class="{active: showTab == 'about'}">
          <a class="nav-link pointer" @click="updateShowTab('about')">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link pointer" @click="show()">Feedback</a>
        </li>
        <li class="nav-item logged-in">
          <a class="nav-link pointer">
            <i v-if="!session" class="fas fa-handshake-slash" title="Not logged in" />
            <i v-if="session && !admin" class="far fa-handshake" :title="'Logged in as ' + userName" />
            <i v-if="session && admin" class="fas fa-handshake" :title="'Logged in as ' + userName + ' (Admin)'" />
          </a>
        </li>
      </ul>

      <modal name="feedback" :height="400" :classes="['rounded', 'feedback']">
        <div class="float-right mr-2 mt-1">
          <button type="button" class="close" @click="hide" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="mt-4">
          <h4>Feedback</h4>
          <p class="feedback-form">
            Thanks for playing {{ thisGame }}; we'd love to hear any feedback you have
            so that we can constantly improve things.
          </p>
          <div class="feedback-form">
            <input type="text" id="email" class="form-control" placeholder="Email (optional)">
            <br>
            <textarea id="comments" rows="6" class="form-control" placeholder="Your comments" />
            <br>
            <button class="btn btn-sm btn-secondary smaller-font" @click="sendFeedback()">
              Send Feedback
            </button>
          </div>
        </div>
      </modal>
    </div>
  </nav>
</template>

<script>
import bus from '../socket.js'

import mailFuns from '../lib/mail.js'

export default {
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    session() {
      return this.$store.getters.getSession
    },
    userName() {
      return this.$store.getters.getUserName
    },
    admin() {
      return this.$store.getters.getAdmin
    },
    showTab() {
      return this.$store.getters.getShowTab
    }
  },
  created() {
    this.appName = process.env.VUE_APP_NAME

    let session = localStorage.getItem('session-agilesimulations')
    console.log('Session', session)
    if (session) {
      session = JSON.parse(session)
      bus.$emit('sendCheckLogin', {session: session})
    } else {
      this.clearLogin()
    }

    bus.$on('loginSuccess', (data) => {
      this.$store.dispatch('updateLogin', data)
    })

    bus.$on('logout', () => {
      this.clearLogin()
    })
  },
  methods: {
    clearLogin() {
      const data = {session: '', userName: '', loggedInAsAdmin: false}
      this.$store.dispatch('updateLogin', data)
    },
    updateShowTab(payload) {
      this.$store.dispatch('updateShowTab', payload)
    },
    show () {
      this.$modal.show('feedback')
    },
    hide () {
      this.$modal.hide('feedback')
    },
    sendFeedback() {
      mailFuns.post({
        action: 'Feedback from ' + this.thisGame,
        email: encodeURIComponent(document.getElementById('email').value),
        comments: encodeURIComponent(document.getElementById('comments').value)
        },
        'Thanks for your feedback - we appreciate it!'
      )
      this.hide()
    }
  }
}
</script>

<style lang="scss">
  h1 {
    letter-spacing: initial;
    margin-left: 6px;
    font-weight: bold;
    text-shadow: 2px 2px 3px #444;
    font-size: xx-large;
    line-height: 1;
  }

  .logged-in {

    a {
      padding: 11px 6px !important;

      &:hover {
        cursor: default;
      }
    }

    .fas, .far {
      font-size: x-large;
      color: #fff !important;
      position: relative;
      top: 2px;
    }

    &:hover {

      .fas, .far {
        color: #f4511e !important;
        cursor: default;
      }
    }
  }

  .feedback {
    letter-spacing: 0;
    color: #212529;
  }

  p.feedback-form {
    margin-bottom: 12px;
  }

  .feedback-form {
    width: 80%;
    margin: 0 auto;
  }
</style>
