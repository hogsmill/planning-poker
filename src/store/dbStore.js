
const stats = require('./lib/stats.js')
const demo = require('./lib/demo.js')
const estimation = require('./lib/estimation.js')
const backlogFuns = require('./lib/backlog.js')
const memberFuns = require('./lib/member.js')

const { v4: uuidv4 } = require('uuid')

function newTeam(name) {
  return {
    id: uuidv4(),
    name: name,
    estimationType: 'fibonacci',
    estimationValues: estimation.defaultValues(),
    timerType: 'estimation',
    useEstimationTimer: false,
    timerAutoReveal: false,
    estimationTimerTime: null,
    useDiscussionTimer: false,
    discussionTimerTime: null,
    relativeSizing: true,
    gameView: 'poker',
    logo:  null,
    members: [],
    backlog: []
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
    record.cardId,
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

function addEstimationTypeToOrganisation(db, io, data, debugOn) {
}

function _setOrganisation(db, io, data, debugOn) {

  if (debugOn) { console.log('setOrganisation', data) }

  db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
    if (err) throw err
    data.teams = res.teams
    io.emit('loadOrganisation', data)
    db.gameCollection.updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()}}, function(err, res) {
      if (err) throw err
    })
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
  } else {
    io.emit('stopTimer', data)
    if (autoReveal) {
      data.reveal = true
      io.emit('reveal', data)
    }
  }
}

function _loadOrganisations(db, io) {
  db.gameCollection.find().toArray( function(err, res) {
    if (err) throw err
    io.emit('loadOrganisations', res)
  })
}

function _startAgain(db, io, data) {

  db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
    if (err) throw err
    if (res) {
      const teams = []
      let i, j
      for (i = 0; i < res.teams.length; i++) {
        const team = res.teams[i]
        if (team.id == data.teamId) {
          const backlog = [], members = []
          for (j = 0; j < team.backlog.length; j++) {
            const card = team.backlog[j]
            card.estimate = null
            backlog.push(card)
          }
          for (j = 0; j < team.members.length; j++) {
            const member = memberFuns.clear(team.members[j])
            members.push(member)
          }
          team.backlog = backlog
          team.members = members
          data.team = team
        }
        teams.push(team)
      }
      data.demo = res.demo
      db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
        if (err) throw err
        io.emit('loadTeam', data)
      })
    }
  })
}

module.exports = {

  checkSystemWorkshops: function(db, io, debugOn) {

    if (debugOn) { console.log('checkSystemWorkshops') }

    const demoId = 'ada3f6c5-6929-4b95-abeb-401e0443e23e'
    db.gameCollection.findOne({id: demoId}, function(err, res) {
      if (err) throw err
      if (!res) {
        const organisation = demo.organisation(demoId)
        db.gameCollection.insertOne(organisation, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      } else {
        _loadOrganisations(db, io)
      }
    })
  },


  // Organisation

  setOrganisation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setOrganisation', data) }

    if (data.startOver) {
      db.gameCollection.deleteOne({organisation: data.organisation}, function(err, res) {
        _setOrganisation(db, io, data, debugOn)
      })
    } else {
      _setOrganisation(db, io, data, debugOn)
    }
  },

  // Game

  loadOrganisation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadOrganisation', data) }

    db.gameCollection.findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        db.gameCollection.updateOne({'_id': res._id}, {$set: {lastaccess: new Date().toISOString()}}, function(err, res) {
          if (err) throw err
        })
        delete res._id
        io.emit('loadOrganisation', res)
      }
    })
  },

  loadTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadTeam', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        data.demo = res.demo
        data.team = res.teams.find(function(t) {
          return t.name == data.teamName
        })
        if (data.team) {
          io.emit('loadTeam', data)
        }
      }
    })
  },

  setGameView: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setGameView', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.gameView = data.view
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  updateBacklog: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateBacklog', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.backlog = data.backlog
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  startAgain: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startAgain', data) }

    _startAgain(db, io, data)
  },

  selectCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('selectCard', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = [], backlog = []
            for (let j = 0; j < team.members.length; j++) {
              team.members[j].voted = false
              team.members[j].estimate = 0
              members.push(team.members[j])
            }
            for (let k = 0; k < team.backlog.length; k++) {
              if (team.backlog[k].id == data.id) {
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
        res.teams = teams
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  updateCommittedCards: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateCommittedCards', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.backlog = data.backlog
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  setTimerType: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setTimerType', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.timerType = data.timerType
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  startTimer: function(db, io, data, debugOn) {

    if (debugOn) { console.log('startTimer', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].id == data.teamId) {
            const team = res.teams[i]
            const t = team.timerType == 'estimation' ? team.estimationTimerTime : team.discussionTimerTime
            updateTimer(io, t, data, res.teams[i].timerAutoReveal)
          }
        }
      }
    })
  },

  updateEstimateValue: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimateValue', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              if (team.members[j].id == data.memberId) {
                team.members[j].voted = true
                team.members[j].estimate = data.value
                team.members[j].coffee = false
                team.members[j].question = false
                team.members[j].abstain = false
                team.members[j].away = false
              }
              members.push(team.members[j])
            }
            team.members = members
            team.lowest = stats.lowest(team.members)
            team.highest = stats.highest(team.members)
            team.median = stats.median(team.members)
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  setMemberAbstain: function(db, io, data, debugOn, field) {

    if (debugOn) { console.log('setMemberAbstain', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              if (team.members[j].id == data.memberId) {
                team.members[j].abstain = true
                team.members[j].estimate = null
                team.members[j].voted = true
              }
              members.push(team.members[j])
            }
            team.members = members
            data.team = team
          }
          teams.push(team)
        }
        res.teams = teams
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  setMemberValue: function(db, io, data, debugOn, field) {

    if (debugOn) { console.log('setMemberValue', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let selectedTeam
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              if (team.members[j].id == data.memberId) {
                team.members[j].voted = false
                team.members[j].estimate = null
                team.members[j].coffee = false
                team.members[j].question = false
                team.members[j][data.field] = data.value
              }
              members.push(team.members[j])
            }
            team.members = members
            data.team = team
          }
          teams.push(team)
        }
        res.teams = teams
        const id = res._id
        delete res._id
        db.gameCollection.updateOne({'_id': id}, {$set: res}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
          io.emit('memberAction', data)
        })
      }
    })
  },

  updateAgreedEstimate: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateAgreedEstimate', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const backlog = []
            for (let j = 0; j < team.backlog.length; j++) {
              if (team.backlog[j].id == data.selectedCard.id) {
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
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  reEstimate: function(db, io, data, debugOn) {

    if (debugOn) { console.log('reEstimate', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let i, j
        for (i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (j = 0; j < team.members.length; j++) {
              const member = memberFuns.clear(team.members[j])
              members.push(member)
            }
            team.members = members
            data.team = team
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', data)
        })
      }
    })
  },

  // Facilitator

  addOrganisation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addOrganisation', data) }

    const newOrg =  {
      id: uuidv4(),
      protected: false,
      name: data.name,
      gameView: 'poker',
      created: new Date().toISOString(),
      lastaccess: new Date().toISOString(),
      teams: []
    }
    db.gameCollection.insertOne(newOrg, function(err, res) {
      if (err) throw err
      _loadOrganisations(db, io)
    })
  },

  deleteOrganisation: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteOrganisation', data) }

    db.gameCollection.deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      _loadOrganisations(db, io)
    })
  },

  addTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addTeam', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const team = newTeam(data.name)
        const teams = res.teams
        teams.push(team)
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  updateOnlyHostCanControl: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateOnlyHostCanControl', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        db.gameCollection.updateOne({'_id': res._id}, {$set: {onlyHostCanControl: data.onlyHostCanControl}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  updateFacilitatorControls: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateFacilitatorControls', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        db.gameCollection.updateOne({'_id': res._id}, {$set: {facilitatorControls: data.facilitatorControls}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  deleteTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteTeam', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].id != data.id) {
            teams.push(res.teams[i])
          }
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  setVelocity: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setVelocity', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.id) {
            team.velocity = data.velocity
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  setTeamParameter: function(db, io, data, debugOn, field) {

    if (debugOn) { console.log('setTeamParameter', field, data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.id) {
            if (data.value) {
              team[field] = data.value
            } else {
              team[field] = !team[field]
            }
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
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  addTeamMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addTeamMember', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.members.push({
              id: uuidv4(),
              name: data.name,
              include: true,
              voted: false
            })
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  includeTeamMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('includeTeamMember', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              const member = team.members[j]
              if (member.id == data.id) {
                member.include = !member.include
              }
              members.push(member)
            }
            team.members = members
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  deleteTeamMember: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteTeamMember', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              const member = team.members[j]
              if (member.id != data.id) {
                members.push(member)
              }
            }
            team.members = members
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  makeFacilitator: function(db, io, data, debugOn) {

    if (debugOn) { console.log('makeFacilitator', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const members = []
            for (let j = 0; j < team.members.length; j++) {
              const member = team.members[j]
              member.facilitator = member.id == data.memberId
              members.push(member)
            }
            team.members = members
          }
          teams.push(team)
        }
        data.demo = res.demo
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  setRelativeSizing: function(db, io, data, debugOn) {

    if (debugOn) { console.log('setRelativeSizing', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.relativeSizing = data.relativeSizing
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
        })
      }
    })
  },

  loadBacklog: function(db, io, data, debugOn) {

    if (debugOn) { console.log('loadBacklog', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const backlog = data.replace ? [] : team.backlog
            for (let j = 0; j < data.backlog.length; j++) {
              const card = backlogFuns.newCard(data.backlog[j])
              backlog.push(card)
            }
            team.backlog = backlogFuns.sortByOrder(backlog)
            data.teamName = team.name
            data.backlogLength = backlog.length
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
          io.emit('backlogLoaded', data)
       })
     }
    })
  },

  saveBacklog: function(db, saveDir, logFile, io, data, fs, debugOn) {

    if (debugOn) { console.log('saveBacklog', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const organisation = res.name
        let teamName, teamBacklog = []
        for (let i = 0; i < res.teams.length; i++) {
          if (res.teams[i].id == data.teamId) {
            teamName = res.teams[i].name
            teamBacklog = res.teams[i].backlog
          }
        }
        const fileName = saveDir + data.file
        if (!data.overwrite && fs.existsSync(fileName)) {
          data.status = false
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
              data.status = false
              data.errType = 'general'
              io.emit('backlogSaved', data)
            } else {
              if (debugOn) { console.log('Backlog written to ', fileName) }
              data.status = true
              io.emit('backlogSaved', data)
            }
          })
        }
      }
    })
  },

  addBacklogCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addBacklogCard', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const card = backlogFuns.newCard(data, res.backlog.length + 1)
            team.backlog.push(card)
          }
          teams.push(team)
        }
        data.teams = teams
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
     }
    })
  },

  deleteBacklogCard: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteBacklogCard', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            const backlog = []
            for (let j = 0; j < team.backlog.length; j++) {
              if (team.backlog[j].id != data.id) {
                backlog.push(team.backlog[j])
              }
            }
            team.backlog = backlogFuns.sortByOrder(backlog)
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
     }
    })
  },

  updateEstimationType: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimationType', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId) {
            team.estimationType = data.estimationType
          }
          teams.push(team)
          _startAgain(db, io, data)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  addEstimationType: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationType', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.id || data.allTeams) {
            team.estimationValues[data.estimationType] = []
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  addEstimationValue: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addEstimationValue', data) }

    db.gameCollection.findOne({id: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        for (let i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId || data.allTeams) {
            const order = team.estimationValues[data.estimationType].length + 1
            team.estimationValues[data.estimationType].push({
              name: data.value,
              order: order,
              include: true
            })
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  },

  deleteEstimationValue: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteEstimationValue', data) }

    db.gameCollection.findOne({organisationId: data.organisationId}, function(err, res) {
      if (err) throw err
      if (res) {
        const teams = []
        let i, j, k
        for (i = 0; i < res.teams.length; i++) {
          const team = res.teams[i]
          if (team.id == data.teamId || data.allTeams) {
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
          }
          teams.push(team)
        }
        db.gameCollection.updateOne({'_id': res._id}, {$set: {teams: teams}}, function(err, res) {
          if (err) throw err
          _loadOrganisations(db, io)
       })
      }
    })
  }

}
