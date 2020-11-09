
const { v4: uuidv4 } = require('uuid');

const defaultEstimationValues = {
  't-shirt': ['XS', 'S', 'M', 'L', 'XL'],
  'fibonacci': ['1', '2', '3', '5', '8', '13'],
  'custom': []
}

const defaultBacklog = [
  { id: 1, uid: '1', title: 'Build an API', description: 'Build the API by updating the domain model to allow feature x to connect'},
  { id: 2, uid: '2', title: 'Do the UI', description: 'Update the GUI to allow product selection. Date comes from the API'},
  { id: 3, uid: '3', title: 'Build the login', description: 'Store user details in database'},
  { id: 4, uid: '4', title: 'Add Logging', description: 'Update logging system to log new feature'}
]

const defaultTeams = [
  { name: 'Eagle', include: true, logo: 'eagle.png' },
  { name: 'Dragon', include: true, logo: 'dragon.png' },
  { name: 'Lion', include: true, logo: 'lion.png' },
  { name: 'Gryphen', include: true, logo: 'gryphen.png' }
]

const defaultTeamMembers = [
  { name: 'Steve', uid: '1', include: true, voted: false },
  { name: 'Bill', uid: '2', include: true, voted: false },
  { name: 'Penny', uid: '3', include: true, voted: false },
  { name: 'Mike', uid: '4', include: true, voted: false },
  { name: 'Julia', uid: '5', include: true, voted: false },
  { name: 'Carol', uid: '6', include: true, voted: false }
]

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
    escapeField(record.title, sep),
    escapeField(record.description, sep),
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

function _addTeam(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('addTeam', data) }

  db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
    if (err) throw err
    if (res) {
      const team = {name: data.teamName, backlog: [], members: [], estimationValues: defaultEstimationValues}
      if (res.demo) {
        team.backlog = defaultBacklog
        team.members = defaultTeamMembers
        team.include = true
      }
      const teams = res.teams
      teams.push(team)
      data.teams = teams
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        client.close()
     })
    }
  })
}

function _deleteTeam(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('deleteTeam', data) }

  db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
    if (err) throw err
    if (res) {
      const teams = []
      for (let i = 0; i < res.teams.length; i++) {
        if (res.teams[i].name != data.teamName) {
          teams.push(res.teams[i])
        }
      }
      data.teams = teams
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        client.close()
     })
    }
  })
}

function _addTeamMember(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('addTeamMember', data) }

  db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
    if (err) throw err
    if (res) {
      const teams = []
      for (let i = 0; i < res.teams.length; i++) {
        const team = res.teams[i]
        if (team.name == data.teamName) {
          team.members.push({
            uid: uuidv4(),
            name: data.memberName,
            include: true,
            voted: false
          })
        }
        teams.push(team)
      }
      data.teams = teams
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        client.close()
     })
    }
  })
}

function _deleteTeamMember(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('deleteTeamMember', data) }

  db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
    if (err) throw err
    if (res) {
      const teams = []
      for (let i = 0; i < res.teams.length; i++) {
        const team = res.teams[i]
        if (team.name == data.teamName) {
          const members = []
          for (let j = 0; j < team.members.length; j++) {
            if (team.members[j].name != data.memberName) {
              members.push(res.teams[i].members[j])
            }
          }
          team.members = members
        }
        teams.push(team)
      }
      data.teams = teams
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        client.close()
     })
    }
  })
}

function _loadBacklog(err, client, db, io, data, debugOn) {

  if (debugOn) { console.log('loadBacklog', data) }

  db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
    if (err) throw err
    if (res) {
      const teams = []
      for (let i = 0; i < res.teams.length; i++) {
        const team = res.teams[i]
        if (team.name == data.teamName) {
          const backlog = data.replace ? [] : team.backlog
          for (let j = 0; j < data.backlog.length; j++) {
            data.backlog[j].uid = uuidv4()
            backlog.push(data.backlog[j])
          }
          team.backlog = backlog
          data.backlogLength = backlog.length
        }
        teams.push(team)
      }
      data.teams = teams
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        io.emit('backlogLoaded', data)
        client.close()
     })
   }
  })
}

module.exports = {

  // Organisation

  setOrganisation: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setOrganisation', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (!res) {
        data.teams = data.demo ? defaultTeams : []
        data.estimationValues = defaultEstimationValues
        if (data.demo) {
          for (let i = 0; i < data.teams.length; i++) {
            data.teams[i].members = defaultTeamMembers
            data.teams[i].estimationValues = defaultEstimationValues
            data.teams[i].backlog = defaultBacklog
            data.teams[i].include = true
          }
        }
        db.collection('planningPokerOrganisations').insertOne({organisation: data.organisation, teams: data.teams, estimationTypes: data.estimationValues, demo: data.demo}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          client.close()
        })
      } else {
        data.teams = res.teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {demo: data.demo}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          client.close()
        })
      }
    })
  },

  // Game

  loadTeam:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        data.team = res.teams.find(function(t) {
          return t.name == data.teamName
        })
        io.emit('loadTeam', data)
        client.close()
      }
    })
  },

  selectCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('selectCard', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        let teams = [], selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            const members = [], backlog = []
            for (let j = 0; j < team.members.length; j++) {
              team.members[j].voted = false
              team.members[j].estimate = 0
              members.push(team.members[j])
            }
            for (let k = 0; k < team.backlog.length; k++) {
              if (team.backlog[k].uid == data.uid) {
                team.backlog[k].selected = true
              } else {
                team.backlog[k].selected = false
              }
              backlog.push(team.backlog[k])
            }
            team.members = members
            team.backlog = backlog
            data.team = team
          }
          teams.push(team)
        }
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  updateEstimateValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimateValue', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              if (team.members[j].uid == data.teamMember.uid) {
                team.members[j].voted = true
                team.members[j].estimate = data.value
              }
              members.push(team.members[j])
            }
            team.members = members
            data.team = team
          }
          teams.push(team)
        }
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  updateAgreedEstimate:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateAgreedEstimate', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            const backlog = []
            for (let j = 0; j < team.backlog.length; j++) {
              if (team.backlog[j].uid == data.selectedCard.uid) {
                team.backlog[j].estimate = data.value
              }
              backlog.push(team.backlog[j])
            }
            team.backlog = backlog
            data.team = team
          }
          teams.push(team)
        }
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  // Facilitator

  addTeam:  function(err, client, db, io, data, debugOn) {

    _addTeam(err, client, db, io, data, debugOn)
  },

  includeTeam: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('includeTeam', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.include = data.include
            data.team = team
          }
          teams.push(team)
        }
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  deleteTeam:  function(err, client, db, io, data, debugOn) {

    _deleteTeam(err, client, db, io, data, debugOn)
  },

  addTeamMember:  function(err, client, db, io, data, debugOn) {

    _addTeamMember(err, client, db, io, data, debugOn)
  },

  includeTeamMember: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('includeTeamMember', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            const members = []
            console.log(team.members, data.teamMember)
            for (let j = 0; j < team.members.length; j++) {
              if (team.members[j].uid == data.teamMember.uid) {
                team.members[j].include = data.include
              }
              members.push(team.members[j])
            }
            team.members = members
            data.team = team
          }
          teams.push(team)
        }
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  deleteTeamMember:  function(err, client, db, io, data, debugOn) {

    _deleteTeamMember(err, client, db, io, data, debugOn)
  },

  loadBacklog:  function(err, client, db, io, data, debugOn) {

    _loadBacklog(err, client, db, io, data, debugOn)
  },

  saveBacklog:  function(err, client, db, saveDir, logFile, io, data, fs, debugOn) {

    if (debugOn) { console.log('saveBacklog', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        let teamBacklog = []
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].name == data.teamName) {
            teamBacklog = res.teams[i].backlog
          }
        }
        const fileName = saveDir + data.file
        if (!data.overwrite && fs.existsSync(fileName)) {
          data.errType = 'fileExists'
          io.emit('backlogSaved', data)
        } else {
          let backlog = []
          for (let i = 0; i < teamBacklog.length; i++) {
            const str = createOutputRecord(teamBacklog[i], data.separator)
            backlog.push(str)
          }
          backlog = backlog.join('\n')
          fs.writeFile(fileName, backlog, function (err, returnData) {
            if (err) {
              io.emit('backlogSaved', {organisation: data.organisation, teamName: data.teamName, status: false, errType: 'general', err: err})
            } else {
              if (debugOn) { console.log('Backlog written to ', fileName) }
              io.emit('backlogSaved', {organisation: data.organisation, teamName: data.teamName, status: true})
            }
          })
        }
      }
    })
  },

  addBacklogCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addBacklogCard', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            data.card.uid = uuidv4()
            team.backlog.push(data.card)
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          client.close()
       })
     }
    })
  },

  deleteBacklogCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteBacklogCard', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            const backlog = []
            for (let j = 0; j < team.backlog.length; j++) {
              if (team.backlog[j].uid != data.card.uid) {
                backlog.push(team.backlog[j])
              }
            }
            team.backlog = backlog
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          client.close()
       })
     }
    })
  },

  addEstimationType:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationType', data) }

    if (data.allTeams) {
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
