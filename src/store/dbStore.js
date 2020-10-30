
function createTeam() {

  return {
    teams: [
      { name: 'Eagle' },
      { name: 'Dragon' },
      { name: 'Lion' },
      { name: 'Gryphen' }
    ],
    teamMembers: [
      { name: 'Steve', id: 'aaa', voted: false },
      { name: 'Bill', id: 'bbb', voted: false },
      { name: 'Penny', id: 'ccc', voted: false },
      { name: 'Mike', id: 'eee', voted: false },
      { name: 'Julia', id: 'fff', voted: false },
      { name: 'Carol', id: 'ggg', voted: false }
    ],
    backlog: [],
    estimationValues: {
      't-shirt': ['XS', 'S', 'M', 'L', 'XL'],
      'fibonacci': ['1', '2', '3', '5', '8', '13']
    }
  }
}

function cardsMatch(card1, card2) {
  return card1.id == card2.id && card1.title == card2.title && card1.description == card2.description
}

function createOutputRecord(record, sep) {
  record = [
    record.id,
    record.title,
    record.description,
    record.estimate
  ]
  let outputRecord = ''
  switch(sep) {
    case 'tab':
      outputRecord = record.join('\t')
      break
    case 'comma':
      outputRecord = record.join(/,/)
      break
    case 'space':
      outputRecord = record.join(/\s/)
      break
  }
  return outputRecord
}

module.exports = {

  // Game

  loadTeam:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading team \'' + data.teamName + '\'')
        io.emit('loadTeam', res)
      } else {
        const team = createTeam()
        team.teamName = data.teamName
        team.created = new Date().toISOString()
        console.log('Created new team \'' + data.teamName + '\'')
        db.collection('planningPoker').insertOne(team, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
        })
      }
    })
  },

  selectCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('clearEstimates', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let i
        const members = [], backlog = []
        for (i = 0; i < res.teamMembers.length; i++) {
          res.teamMembers[i].voted = false
          res.teamMembers[i].estimate = 0
          members.push(res.teamMembers[i])
        }
        res.teamMembers = members
        for (i = 0; i < res.backlog.length; i++) {
          if (res.backlog[i].id == data.selectedCard) {
            res.backlog[i].selected = true
          } else {
            res.backlog[i].selected = false
          }
          backlog.push(res.backlog[i])
        }
        res.backlog = backlog
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
        })
      }
    })
  },

  updateEstimateValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimateValue', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const members = []
        for (let i = 0; i < res.teamMembers.length; i++) {
          if (res.teamMembers[i].id == data.teamMember.id) {
            res.teamMembers[i].voted = true
            res.teamMembers[i].estimate = data.value
          }
          members.push(res.teamMembers[i])
        }
        res.teamMembers = members
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {teamMembers: members}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
        })
      }
    })
  },

  updateAgreedEstimate:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateAgreedEstimate', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const backlog = []
        for (let i = 0; i < res.backlog.length; i++) {
          if (res.backlog[i].id == data.selectedCard.id) {
            res.backlog[i].estimate = data.value
          }
          backlog.push(res.backlog[i])
        }
        res.backlog = backlog
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
        })
      }
    })
  },

  // Facilitator

  loadBacklog:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadBacklog', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        for (let i = 0; i < data.backlog.length; i++) {
          res.backlog.push(data.backlog[i])
        }
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: res.backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
       })
     }
    })
  },

  saveBacklog:  function(saveDir, logFile, data, fs, debugOn) {

    if (debugOn) { console.log('saveBacklog', data) }

    const fileName = saveDir + data.file
    let backlog = []
    for (let i = 0; i < data.backlog.length; i++) {
      var str = createOutputRecord(data.backlog[i], data.seperator)
      backlog.push(str)
    }
    backlog = backlog.join('\n')
    fs.writeFile(fileName, backlog, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        if (debugOn) { console.log('Backlog written to ', fileName) }
      }
    })
  },

  addBacklogCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addBacklogCard', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        res.backlog.push(data.card)
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: res.backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
       })
     }
    })
  },

  deleteBacklogCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteBacklogCard', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let backlog = [], found = false
        for (let i = 0; i < res.backlog.length; i++) {
          if (cardsMatch(res.backlog[i], data.card)) {
            found = true
          } else {
            backlog.push(res.backlog[i])
          }
        }
        res.backlog = backlog
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
       })
     }
    })
  },

  addEstimationValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationValue', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const estimationValues = res.estimationValues[data.estimationType]
        estimationValues.push(data.value)
        res.estimationValues[data.estimationType] = estimationValues
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {estimationValues: res.estimationValues}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
       })
     }
    })
  },

  deleteEstimationValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteEstimationValue', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const estimationValues = []
        for (let i = 0; i < res.estimationValues[data.estimationType].length; i++) {
          if (res.estimationValues[data.estimationType][i] != data.value) {
            estimationValues.push(res.estimationValues[data.estimationType][i])
          }
        }
        res.estimationValues[data.estimationType] = estimationValues
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {estimationValues: res.estimationValues}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
       })
     }
    })
  }

}
