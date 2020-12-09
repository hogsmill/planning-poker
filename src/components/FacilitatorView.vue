<template>
  <div>
    <div class="connections">
      Current server connections: {{ connections.connections }} / {{ connections.maxConnections }}
    </div>
    <Teams :socket="socket" />
    <TeamMembers :socket="socket" />
    <Estimates :socket="socket" />
    <Backlog :socket="socket" />
  </div>
</template>

<script>
import Teams from './facilitator/Teams.vue'
import TeamMembers from './facilitator/TeamMembers.vue'
import Estimates from './facilitator/Estimates.vue'
import Backlog from './facilitator/Backlog.vue'

export default {
  components: {
    Teams,
    TeamMembers,
    Estimates,
    Backlog
  },
  props: [
    'socket'
  ],
  computed: {
    connections() {
      return this.$store.getters.getConnections
    }
  }
}
</script>

<style lang="scss">
.facilitator-table {

    width: 90%;
    max-width: 800px;
    margin: 12px auto;
    border: 1px solid #ccc;

    button {
      margin-left: 6px;
    }

    .inner-table {
      padding: 0;
      border: none;

      td {
        border: 0;
      }
    }
    .toggle {
      color: #aaa;
      font-size: xx-large;
      position: absolute;
      right: 6px;
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 50%;
      display: inline-block;
      text-align: left;
    }

    td {
      vertical-align: top;
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }

      &.left-col {
        vertical-align: top;
      }

      &.upload {
        div {
          padding: 6px;
          min-width: 300px;
        }
      }
    }

    input[type=text] {
      min-width: 120px;
      height: 24px;
      padding: 2px;
      margin: 0 auto;
    }
    input[type=number] {
      min-width: 60px;
      height: 24px;
      padding: 2px;
      margin: 0 auto;
      text-align: right;
    }
    input[type=checkbox] {
      min-width: 30px;
    }
    select {
      min-width: 120px;
    }
  }
</style>
