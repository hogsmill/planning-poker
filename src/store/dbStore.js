
const estimationValues = {
  't-shirt': ['XS', 'S', 'M', 'L', 'XL'],
  'fibonacci': ['1', '2', '3', '5', '8', '13'],
  'custom': []
}

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
    estimationValues: estimationValues
  }
}

function cardsMatch(card1, card2) {
  return card1.id == card2.id && card1.title == card2.title && card1.description == card2.description
}

function escapeField(field, seperator) {
  switch(seperator) {
    case 'tab':
      return field
      break
    case 'comma':
      return field.match(',') ? '"' + field + '"' : field
      break
    case 'semicolon':
      return field.match(';') ? '"' + field + '"' : field
      break
    case 'colon':
      return field.match(':') ? '"' + field + '"' : field
      break
    case 'space':
      return '"' + field.replace(/"/g, '\'') + '"'
      break
  }
}

function createOutputRecord(record, sep) {
  record = [
    record.id,
    record.escapeField(record.title, sep),
    record.escapeField(record.description, sep),
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
    case 'semicolon':
      outputRecord = record.join(/;/)
      break
    case 'colon':
      outputRecord = record.join(/:/)
      break
    case 'space':
      outputRecord = record.join(/\s/)
      break
  }
  return outputRecord
}

function addEstimationTypeToOrganisation(err, client, db, io, data, debugOn) {
}

module.exports = {

  // Organisation

  setOrganisation: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setOrganisation', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (!res) {
        res = {
          organisation: data.organisation,
          teams: [],
          estimationValues: estimationValues
        }
        db.collection('planningPokerOrganisations').insertOne({organisation: data.organisation, teams: []}, function(err, res) {
          if (err) throw err
          client.close()
        })
      }
    })
  },

  // Game

  loadTeam:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName, organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        console.log('Loading team \'' + data.organisation + ': ' + data.teamName + '\'')
        io.emit('loadTeam', res)
      } else {
        const team = createTeam()
        team.teamName = data.teamName
        team.organisation = data.organisation
        team.created = new Date().toISOString()
        console.log('Created new team \'' + data.organisation + ': ' + data.teamName + '\'')
        db.collection('planningPoker').insertOne(team, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          client.close()
        })
      }
    })
  },

  selectCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('selectCard', data) }

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
        console.log(members)
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
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: backlog, teamMembers: members}}, function(err, res) {
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
        if (data.replace) {
          res.backlog = []
        }
        for (let i = 0; i < data.backlog.length; i++) {
          res.backlog.push(data.backlog[i])
        }
        const team = res
        team.backlogLength = res.backlog.length
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {backlog: res.backlog}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', team)
          io.emit('backlogLoaded', team)
          client.close()
       })
     }
    })
  },

  saveBacklog:  function(saveDir, logFile, io, data, fs, debugOn) {

    if (debugOn) { console.log('saveBacklog', data) }

    const fileName = saveDir + data.file
    if (!data.overwrite && fs.existsSync(fileName)) {
      data.errType = 'fileExists'
      io.emit('backlogSaved', data)
    } else {
      let backlog = []
      for (let i = 0; i < data.backlog.length; i++) {
        const str = createOutputRecord(data.backlog[i], data.seperator)
        backlog.push(str)
      }
      backlog = backlog.join('\n')
      fs.writeFile(fileName, backlog, function (err, returnData) {
        if (err) {
          io.emit('backlogSaved', {teamName: data.teamName, status: false, errType: 'general', err: err})
        } else {
          if (debugOn) { console.log('Backlog written to ', fileName) }
          io.emit('backlogSaved', {teamName: data.teamName, status: true})
        }
      })
    }
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
        const backlog = []
        let found = false
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

  addEstimationType:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationType', data) }

    if (!data.teamOnly) {
      addEstimationTypeToOrganisation(err, client, db, io, data, debugOn)
    }
    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        const estimationValues = res.estimationValues
        estimationValues[data.estimationType] = []
        res.estimationValues = estimationValues
        const team = res
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {estimationTypes: res.estimationTypes}}, function(err, res) {
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
