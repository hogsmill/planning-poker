
function lowestObject(members) {
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
}

function lowestNumeric(members) {
  let lowest = -1
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (member.voted) {
      if (lowest < 0 || parseInt(member.estimate) <= lowest) {
        lowest = parseInt(member.estimate)
      }
    }
  }
  return lowest
}

function higestObject(members) {
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
}

function highestNumeric(members) {
  let highest = -1
  for (let i = 0; i < members.length; i++) {
    const member = members[i]
    if (member.voted) {
      if (highest < 0 || parseInt(member.estimate) >= highest) {
        highest = parseInt(member.estimate)
      }
    }
  }
  return highest
}

module.exports = {

  lowest: function(members, numeric) {
    return numeric ? lowestNumeric(members) : lowestObject(members)
  },

  highest: function(members, numeric) {
    return numeric ? highestNumeric(members) : highestObject(members)
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
  },

  mean: function(members) {
    let total = 0
    for (let i = 0; i < members.length; i++) {
      total = total + parseInt(members[i].estimate)
    }
    return total / members.length
  }

}
