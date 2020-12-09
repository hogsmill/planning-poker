
const { v4: uuidv4 } = require('uuid')

const defaultEstimationValues = {
  'fibonacci': [
    { order: 1, name: '1', include: true },
    { order: 2, name: '2', include: true },
    { order: 3, name: '3', include: true },
    { order: 4, name: '5', include: true },
    { order: 5, name: '8', include: true },
    { order: 6, name: '13', include: true }
  ],
  't-shirt': [
    { order: 1, name: 'XS', include: true },
    { order: 2, name: 'S', include: true },
    { order: 3, name: 'M', include: true },
    { order: 4, name: 'L', include: true },
    { order: 5, name: 'XL', include: true }
  ],
  'relative': [
    { order: 1, name: 'XS', include: true, icon: 'agile_sims_relative_xs.png' },
    { order: 2, name: 'S', include: true, icon: 'agile_sims_relative_s.png' },
    { order: 3, name: 'M', include: true, icon: 'agile_sims_relative_m.png' },
    { order: 4, name: 'L', include: true, icon: 'agile_sims_relative_l.png' },
    { order: 5, name: 'XL', include: true, icon: 'agile_sims_relative_xl.png' }
  ],
  'fruit': [
    { order: 1, name: 'grape', include: true, icon: 'agile_sims_fruit_grape.jpg' },
    { order: 2, name: 'cherry', include: true, icon: 'agile_sims_fruit_cherry.jpg' },
    { order: 3, name: 'apple', include: true, icon: 'agile_sims_fruit_apple.jpg' },
    { order: 4, name: 'kiwi', include: true, icon: 'agile_sims_fruit_kiwi.jpg' },
    { order: 5, name: 'watermelon', include: true, icon: 'agile_sims_fruit_watermelon.jpg' },
    { order: 6, name: 'pineapple', include: true, icon: 'agile_sims_fruit_pineapple.jpg' }
  ],
  'custom': []
}

const defaultBacklog = [
  { id: 1, uid: '1', order: 1, title: 'Build an API', selected: false, committed: false, description: 'Build the API by updating the domain model to allow feature x to connect'},
  { id: 2, uid: '2', order: 2, title: 'Do the UI', selected: false, committed: false, description: 'Update the GUI to allow product selection. Date comes from the API'},
  { id: 3, uid: '3', order: 3, title: 'Build the login', selected: false, committed: false, description: 'Store user details in database'},
  { id: 4, uid: '4', order: 4, title: 'Add Logging', selected: false, committed: false, description: 'Update logging system to log new feature'}
]

const defaultTeams = [
  { name: 'Eagle', estimationType: 'fibonacci', include: true, velocity: 20, timerType: 'estimation', useEstimationTimer: true, timerAutoReveal: false, estimationTimerTime: 30, useDiscussionTimer: true, discussionTimerTime: 120, relativeSizing: true, gameView: 'poker', logo: 'agile_sims_icon_eagle.png' },
  { name: 'Lion', estimationType: 't-shirt', include: true, velocity: 20, timerType: 'estimation', timerType: '', useEstimationTimer: true, timerAutoReveal: false, estimationTimerTime: 30, useDiscussionTimer: true, discussionTimerTime: 120, relativeSizing: true, gameView: 'poker', logo: 'agile_sims_icon_lion.png' },
  { name: 'Dragon', estimationType: 'relative', include: true, velocity: 20, timerType: 'estimation', useEstimationTimer: true, timerAutoReveal: false, estimationTimerTime: 30, useDiscussionTimer: true, discussionTimerTime: 120, relativeSizing: true, gameView: 'poker', logo: 'agile_sims_icon_dragon.png' },
  { name: 'Gryphen', estimationType: 'fruit', include: true, velocity: 20, timerType: 'estimation', useEstimationTimer: true, timerAutoReveal: false, estimationTimerTime: 30, useDiscussionTimer: true, discussionTimerTime: 120, relativeSizing: true, gameView: 'poker', logo: 'agile_sims_icon_gryphen.png' }
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
        team.relativeSizing = true,
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
            data.backlog[i].selected = false
            data.backlog[i].committed = false
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

function _setOrganisation(err, client, db, io, data, debugOn) {

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
          data.teams[i].gameView = 'poker'
        }
      }
      const created = new Date().toISOString()
      const lastaccess = new Date().toISOString()
      db.collection('planningPokerOrganisations').insertOne({organisation: data.organisation, created: created, lastaccess: data.lastaccess, teams: data.teams, estimationTypes: data.estimationValues, demo: data.demo}, function(err, res) {
        if (err) throw err
        io.emit('loadOrganisation', data)
        client.close()
      })
    } else {
      db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()}}, function(err, res) {
        if (err) throw err
      })
      data.teams = res.teams
      if (!data.demo) {
        io.emit('loadOrganisation', data)
      } else {
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {demo: data.demo}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          client.close()
        })
      }
    }
  })
}

function updateTimer(io, t, data, autoReveal) {
  data.time = t
  io.emit('updateTimer', data)
  t = t - 1
  if (t >= 0) {
    setTimeout(function() {
      updateTimer(io, t, data, autoReveal)
    }, 1000)
  } else if (autoReveal) {
    data.reveal = true
    io.emit('reveal', data)
  }
}

module.exports = {

  // Organisation

  setOrganisation: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setOrganisation', data) }

    if (data.startOver) {
      db.collection('planningPokerOrganisations').deleteOne({organisation: data.organisation}, function(err, res) {
        _setOrganisation(err, client, db, io, data, debugOn)
      })
    } else {
      _setOrganisation(err, client, db, io, data, debugOn)
    }
  },

  // Game

  loadTeam:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        data.demo = res.demo
        data.team = res.teams.find(function(t) {
          return t.name == data.teamName
        })
        io.emit('loadTeam', data)
        client.close()
      }
    })
  },

  setGameView:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setGameView', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.gameView = data.view
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  updateBacklog:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateBacklog', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.backlog = data.backlog
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  selectCard:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('selectCard', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
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
        data.demo = res.demo
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  updateCommittedCards:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateCommittedCards', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.backlog = data.backlog
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  setTimerType:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setTimerType', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.timerType = data.timerType
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          client.close()
        })
      }
    })
  },

  startTimer:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('startTimer', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].name == data.teamName) {
            const team = res.teams[i]
            const t = team.timerType == 'estimation' ? team.estimationTimerTime : team.discussionTimerTime
            updateTimer(io, t, data, res.teams[i].timerAutoReveal)
          }
        }
      }
      client.close()
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
        data.demo = res.demo
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
            team.backlog = backlog.sort(function(a, b) {
              a = a.estimate ? a.estimate : { order: 0 }
              b = b.estimate ? b.estimate : { order: 0 }
              return b.order - a.order
            })
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
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

  setTeamParameter: function(err, client, db, io, data, debugOn, field) {

    if (debugOn) { console.log('setTeamParameter', field, data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team[field] = data[field]
          }
          if (field == 'useEstimationTimer' || field == 'useDiscussionTimer') {
            if (team.useEstimationTimer && !team.useDiscussionTimer) {
              team.timerType = 'estimation'
            }
            if (!team.useEstimationTimer && team.useDiscussionTimer) {
              team.timerType = 'discussion'
            }
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeams', data)
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
        data.demo = res.demo
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

  setRelativeSizing: function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('setRelativeSizing', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].name == data.teamName) {
            res.teams[i].relativeSizing = data.relativeSizing
          }
          teams.push(res.teams[i])
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeams', data)
          client.close()
        })
      }
    })
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

  updateEstimationType:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimationType', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName) {
            team.estimationType = data.estimationType
            data.estimateTeam = team
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          io.emit('updateEstimateTeam', data)
          client.close()
       })
      }
    })
  },

  addEstimationType:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationType', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName || data.allTeams) {
            team.estimationValues[data.estimationType] = []
            data.estimateTeam = team
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          io.emit('updateEstimateTeam', data)
          client.close()
       })
      }
    })
  },

  addEstimationValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationValue', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName || data.allTeams) {
            const order = team.estimationValues[data.estimationType].length + 1
            team.estimationValues[data.estimationType].push({
              name: data.value,
              order: order,
              include: true
            })
            data.estimateTeam = team
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          io.emit('updateEstimateTeam', data)
          client.close()
       })
      }
    })
  },

  deleteEstimationValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('deleteEstimationValue', data) }

    db.collection('planningPokerOrganisations').findOne({organisation: data.organisation}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let i, j, k
        for (i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.name == data.teamName || data.allTeams) {
            const estimationTypes = [], estTypes = team.estimationValues[data.estimationType]
            for (j = 0; j < estTypes.length; j++) {
              if (estTypes[j].name != data.value) {
                estimationTypes.push(estTypes[j])
              }
            }
            for (j = 0, k = 1; j < estimationTypes.length; j++, k++) {
              estimationTypes[j].order = k
            }
            team.estimationValues[data.estimationType] = estimationTypes
            data.estimateTeam = team
          }
          teams.push(team)
        }
        data.teams = teams
        db.collection('planningPokerOrganisations').updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadOrganisation', data)
          io.emit('updateEstimateTeam', data)
          client.close()
       })
      }
    })
  }

}
