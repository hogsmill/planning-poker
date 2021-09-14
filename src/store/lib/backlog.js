
const { v4: uuidv4 } = require('uuid')

const numeric = [
  'fibonacci',
  'No Estimates',
  'No Estimates (PC)'
]

const countCards = [
  'No Estimates',
  'No Estimates (PC)'
]

function isNumeric(estimationType) {
  return numeric.indexOf(estimationType) > -1
}

function isCountCards(estimationType) {
  return countCards.indexOf(estimationType) > -1
}

module.exports = {

  newCard: function(data, n) {
    return {
      id: uuidv4(),
      cardId: data.cardId ? data.cardId : '',
      order: n,
      title: data.title,
      selected: false,
      committed: false,
      description: data.description,
      estimate: 0
    }
  },

  isNumeric: function(estimationType) {
    return isNumeric(estimationType)
  },

  sortByOrder: function(backlog) {
    backlog = backlog.sort(function(a, b) {
      const orderA = parseInt(a.order)
      const orderB = parseInt(b.order)
      return orderA - orderB
    })
    const newBacklog = []
    for (let i = 0, j = 1; i < backlog.length; i++, j++) {
      backlog[i].order = j
      newBacklog.push(backlog[i])
    }
    return newBacklog
  },

  clearCommit: function(teamBacklog) {
    const backlog = []
    for (let i = 0; i < teamBacklog.length; i++) {
      const card = teamBacklog[i]
      card.committed = false
      card.overCommitted = false
      backlog.push(card)
    }
    return backlog
  },

  commitCard: function(teamBacklog, cardId, commit) {
    const backlog = []
    for (let i = 0; i < teamBacklog.length; i++) {
      const card = teamBacklog[i]
      if (card.id == cardId) {
        card.committed = commit
      }
      backlog.push(card)
    }
    return backlog
  },

  moveCard: function(teamBacklog, cardId, direction) {
    const backlog = []
    const thisCard = teamBacklog.find((c) => {
      return c.id == cardId
    })
    const thisOrder = thisCard.order
    const thisCommitted = thisCard.committed
    const thatOrder = direction == 'left' ? thisOrder - 1 : thisOrder + 1
    const thatCard = teamBacklog.find((c) => {
      return c.order == thatOrder
    })
    const thatCommitted = thatCard.committed
    for (let i = 0; i < teamBacklog.length; i++) {
      const card = teamBacklog[i]
      if (card.cardId == thatCard.cardId) {
        card.order = thisOrder
        card.committed = thisCommitted
      }
      if (card.cardId == thisCard.cardId) {
        card.order = thatOrder
        card.committed = thatCommitted
      }
      backlog.push(card)
    }
    return backlog
  },

  committed: function(backlog, estimationType) {
    let n = 0
    const isNum = isNumeric(estimationType)
    const isCount = isCountCards(estimationType)
    for (let i = 0; i < backlog.length; i++) {
      if (backlog[i].committed) {
        if (isNum) {
          if (isCount) {
            n = n + 1
          } else {
            const estimate = backlog[i].estimate.name ? parseInt(backlog[i].estimate.name) : 0
            n = n + estimate
          }
        }
      }
    }
    return n
  },

  overCommitted: function(teamBacklog, estimationType, velocity) {
    const backlog = []
    let n = 0, overCommitted = false
    const isNum = isNumeric(estimationType)
    const isCount = isCountCards(estimationType)
    teamBacklog = teamBacklog.sort((a, b) => {
      return a.order - b.order
    })
    for (let i = 0; i < teamBacklog.length; i++) {
      const card = teamBacklog[i]
      if (card.committed) {
        if (isNum) {
          if (isCount) {
            n = n + 1
          } else {
            n = n + parseInt(card.estimate.name)
          }
        }
      }
      overCommitted = overCommitted || n > velocity
      card.overCommitted = card.committed && n > velocity
      backlog.push(card)
    }
    return backlog
  }
}
