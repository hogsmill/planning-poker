
const backlogFuns = require('./backlog.js')
const estimation = require('./estimation.js')

const demoTeams = [
  { name: 'Eagle', id: 'd49b10b0-da70-4605-9467-b2f146e2b9bb', estimationType: 'fibonacci', logo: 'agile_sims_icon_eagle.png' },
  { name: 'Lion', id: 'd2dbf3f0-64e9-4e87-b688-7de2d2327a94', estimationType: 't-shirt', logo: 'agile_sims_icon_lion.png' },
  { name: 'Dragon', id: '399c9858-4cdd-429a-ad2e-111646eea5b8', estimationType: 'relative', logo: 'agile_sims_icon_dragon.png' },
  { name: 'Gryphen', id: '95f9cc7a-82bb-4f1a-9900-75a1a05f3825', estimationType: 'fruit', logo: 'agile_sims_icon_gryphen.png' }
]

const demoTeamMembers = [
  { name: 'Steve', id: '13b71921-63ed-4972-ba21-f9828592edd6' },
  { name: 'Bill', id: 'a0cb2724-9e81-4f1e-9881-76ebe4c27c2e' },
  { name: 'Penny', id: '70a8e202-948c-41b5-b698-be9fe1d01cfe' },
  { name: 'Mike', id: 'a0d88510-0e68-48fb-be8a-ca4bb9bec890' },
  { name: 'Julia', id: 'c6c328f3-e6c0-4e44-b9b6-6d032c906d5b' },
  { name: 'Carol', id: '43f16052-72b2-4de4-97ab-185431da5942' }
]

const demoBacklog = [
  { cardId: '#1', title: 'Build an API', description: 'Build the API by updating the domain model to allow feature x to connect'},
  { cardId: '#2', title: 'Do the UI', description: 'Update the GUI to allow product selection. Date comes from the API'},
  { cardId: '#3', title: 'Build the login', description: 'Store user details in database'},
  { cardId: '#4', title: 'Add Logging', description: 'Update logging system to log new feature'}
]

function createDemoBacklog() {
  const backlog = []
  for (let i = 0, j = 1; i < demoBacklog.length; i++, j++) {
    const card = backlogFuns.newCard(demoBacklog[i], j)
    backlog.push(card)
  }
  return backlog
}

function demoMember(i, teamName) {
  const member = demoTeamMembers[i]
  return {
    id: member.id,
    name: member.name + ' ' + teamName,
    include: true,
    voted: false,
    protected: true
  }
}

function teamMembers(teamName) {
  const members = []
  for (let i = 0; i < demoTeamMembers.length; i++) {
    const member = demoMember(i, teamName)
    members.push(member)
  }
  return members
}

function teams() {
  const teams = []
  for (let i = 0; i < demoTeams.length; i++) {
    const teamName = demoTeams[i].name
    teams.push({
      id: demoTeams[i].id,
      protected: true,
      name: teamName,
      members: teamMembers(teamName),
      estimationType: demoTeams[i].estimationType,
      estimationValues: estimation.defaultValues(),
      backlog: createDemoBacklog(),
      lowest: null,
      median: null,
      highest: null,
      include: true,
      velocity: 20,
      timerType: 'estimation',
      useEstimationTimer: true,
      timerAutoReveal: false,
      estimationTimerTime: 30,
      useDiscussionTimer: true,
      discussionTimerTime: 120,
      relativeSizing: true,
      gameView: 'poker',
      logo:  demoTeams[i].logo
    })
  }
  return teams
}

module.exports = {

  organisation: function(id) {
    return {
      id: id,
      protected: true,
      name: 'Demo',
      gameView: 'poker',
      created: new Date().toISOString(),
      lastaccess: new Date().toISOString(),
      teams: teams()
    }
  }
}
