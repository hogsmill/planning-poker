
module.exports = {

  lowest: function(members) {
    let lowest = null
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      if (member.voted) {
        if (!lowest || (member.estimate && member.estimate.order <= lowest.order)) {
          lowest = member.estimate
        }
      }
    }
    return lowest ? lowest.name : ''
  },

  highest: function(members) {
    let highest = null
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      if (member.voted) {
        if (!highest || member.estimate.order >= highest.order) {
          highest = member.estimate
        }
      }
    }
    return highest ? highest.name : ''
  },

  median: function(members) {
    let voted = []
    for (let i = 0; i < members.length; i++) {
      if (members[i].voted) {
        voted.push(members[i].estimate)
      }
    }
    voted = voted.sort(function(a, b) {
      return a.order - b.order
    })
    const l = parseInt(voted.length / 2)
    return voted[l].name
  }
}
