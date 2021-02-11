
const { v4: uuidv4 } = require('uuid')

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
  }
}
