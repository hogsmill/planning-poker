<template>
  <div v-if="round.running && index == gameState.round && gameState.rounds[index].roles[roleIndex]">
    <div v-for="(coin, coinIndex) in gameState.rounds[index].roles[roleIndex].coins"
         :coin="coin"
         :coinIndex="coinIndex"
         :key="coinIndex"
         class="coin-parent"
         @click="playCoin(coinIndex, gameState.rounds[index].roles[roleIndex], gameState.rounds[index])"
    >
      <div
        class="coin"
        data-toggle="tooltip" data-placement="top" :title="coinNames[coin.value]"
        :class="[getClassName(role), getValueName(coin)]"
      />
    </div>
  </div>
</template>

<script>
import timeFuns from '../../../lib/timeFuns.js'

export default {
  props: [
    'socket',
    'round',
    'role',
    'index',
    'roleIndex'
  ],
  data() {
    return {
      coinClasses: {
        1: 'one-p',
        2: 'two-p',
        5: 'five-p',
        10: 'ten-p',
        20: 'twenty-p',
        50: 'fifty-p',
        100: 'one-pound',
        200: 'two-pound'
      },
      coinNames: {
        1: '1p',
        2: '2p',
        5: '5p',
        10: '10p',
        20: '20p',
        50: '50p',
        100: '£1',
        200: '£2'
      }
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
    getClassName(role) {
      return role.role.replace(' ', '-').toLowerCase()
    },
    getValueName(coin) {
      let classStr = this.coinClasses[coin.value]
      if (coin.played) {
        classStr = classStr + ' played'
      }
      return classStr
    },
    outOfTime(round) {
      return timeFuns.outOfTime(round, this.gameState)
    },
    canPlayCoin(coin, role, round) {
       return role.role != 'Customer' && !this.outOfTime(round)
    },
    playCoin(coin, role, round) {
      if (this.canPlayCoin(coin, role, round)) {
        this.socket.emit('playCoin', { gameName: this.gameName, coin: coin, role: role.role, round: round.name })
      }
    }
  }
}
</script>

<style lang="scss">

.coin-parent {
  display: inline-block;
  height: 20px;
  width: 20px;
}

.coin {
  opacity: 0.3;
  height: 20px;
  width: 20px;
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center center;

  &:hover {
    cursor: pointer;
  }
}

.played, .customer { opacity: 1; }

.one-p { background-image: url("../../../assets/img/1p.png"); }
.two-p { background-image: url("../../../assets/img/2p.png"); }
.five-p { background-image: url("../../../assets/img/5p.png"); }
.ten-p { background-image: url("../../../assets/img/10p.png"); }
.twenty-p { background-image: url("../../../assets/img/20p.png"); }
.fifty-p { background-image: url("../../../assets/img/50p.png"); }
.one-pound { background-image: url("../../../assets/img/1pound.png"); }
.two-pound { background-image: url("../../../assets/img/2pound.png"); }

</style>
