

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
    backlog: [
      { id: 1, selected: false, estimate: 0, title: 'Build an API', description: 'Build the API by updating the domain model to allow feature x to connect'},
      { id: 2, selected: false, estimate: 0, title: 'Do the UI', description: 'Update the GUI to allow product selection. Date comes from the API' },
      { id: 3, selected: false, estimate: 0, title: 'Build the login', description: 'Store user details in database' },
      { id: 4, selected: false, estimate: 0, title: 'Add Logging', description: 'Update logging system to log new feature' }
    ],
    estimationValues: {
      't-shirt': ['XS', 'S', 'M', 'L', 'XL'],
      'fibonacci': ['1', '2', '3', '5', '8', '13']
    }
  }
}
module.exports = {

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

  updateEstimateValue:  function(err, client, db, io, data, debugOn) {

    if (debugOn) { console.log('updateEstimateValue', data) }

    db.collection('planningPoker').findOne({teamName: data.teamName}, function(err, res) {
      if (err) throw err
      if (res) {
        let members = []
        console.log(res.teamMembers)
        for (let i = 0; i < res.teamMembers.length; i++) {
          if (res.teamMembers[i].id == data.teamMember.id) {
            res.teamMembers[i].voted = true
            res.teamMembers[i].estimate = data.value
          }
          members.push(res.teamMembers[i])
        }
        console.log(members)
        res.teamMembers = members
        db.collection('planningPoker').updateOne({'_id': res._id}, {$set: {teamMembers: members}}, function(err, res) {
          if (err) throw err
          io.emit('loadTeam', res)
          client.close()
        })
      }
    })
  }
}
