import io from 'socket.io-client'
import bus from './EventBus'

let asConnStr, connStr
if (location.hostname == 'localhost') {
  asConnStr = 'http://localhost:3099'
  connStr = 'http://localhost:3004'
} else {
  asConnStr = 'https://agilesimulations.co.uk:3099'
  connStr = 'https://agilesimulations.co.uk:' + process.env.VUE_APP_PORT
}
console.log('Connecting to: ' + asConnStr)
const asSocket = io(asConnStr)
console.log('Connecting to: ' + connStr)
const socket = io(connStr)

// Agile Simulations (login)

bus.$on('sendCheckLogin', (data) => { asSocket.emit('sendCheckLogin', data) })

asSocket.on('loginSuccess', (data) => { bus.$emit('loginSuccess', data) })

asSocket.on('logout', (data) => { bus.$emit('logout', data) })

// --- Send ---

// Game

bus.$on('sendCheckSystemWorkshops', (data) => { socket.emit('sendCheckSystemWorkshops', data) })

bus.$on('sendMakeFacilitator', (data) => { socket.emit('sendMakeFacilitator', data) })

bus.$on('sendLoadTeam', (data) => { socket.emit('sendLoadTeam', data) })

bus.$on('sendSetGameView', (data) => { socket.emit('sendSetGameView', data) })

bus.$on('sendSelectCard', (data) => { socket.emit('sendSelectCard', data) })

bus.$on('sendSetTimerType', (data) => { socket.emit('sendSetTimerType', data) })

bus.$on('sendStartTimer', (data) => { socket.emit('sendStartTimer', data) })

bus.$on('sendStopTimer', (data) => { socket.emit('sendStopTimer', data) })

bus.$on('sendUpdateAway', (data) => { socket.emit('sendUpdateAway', data) })

bus.$on('sendMemberAbstain', (data) => { socket.emit('sendMemberAbstain', data) })

bus.$on('sendSetMemberValue', (data) => { socket.emit('sendSetMemberValue', data) })

bus.$on('sendUpdateEstimateValue', (data) => { socket.emit('sendUpdateEstimateValue', data) })

bus.$on('sendReveal', (data) => { socket.emit('sendReveal', data) })

bus.$on('sendReEstimate', (data) => { socket.emit('sendReEstimate', data) })

bus.$on('sendUpdateAgreedEstimate', (data) => { socket.emit('sendUpdateAgreedEstimate', data) })

bus.$on('sendUpdateBacklog', (data) => { socket.emit('sendUpdateBacklog', data) })

bus.$on('sendStartAgain', (data) => { socket.emit('sendStartAgain', data) })


// Facilitator

bus.$on('sendOpenEditPane', (data) => { socket.emit('sendOpenEditPane', data) })

bus.$on('sendAddOrganisation', (data) => { socket.emit('sendAddOrganisation', data) })

bus.$on('sendDeleteOrganisation', (data) => { socket.emit('sendDeleteOrganisation', data) })

bus.$on('sendUpdateOnlyAdminCanControl', (data) => { socket.emit('sendUpdateOnlyAdminCanControl', data) })

bus.$on('sendUpdateFacilitatorControls', (data) => { socket.emit('sendUpdateFacilitatorControls', data) })

bus.$on('sendSetRelativeSizing', (data) => { socket.emit('sendSetRelativeSizing', data) })

bus.$on('sendLoadBacklog', (data) => { socket.emit('sendLoadBacklog', data) })

bus.$on('sendAddBacklogCard', (data) => { socket.emit('sendAddBacklogCard', data) })

bus.$on('sendAddBacklogCard', (data) => { socket.emit('sendAddBacklogCard', data) })

bus.$on('sendSaveBacklog', (data) => { socket.emit('sendSaveBacklog', data) })

bus.$on('sendUpdateEstimationType', (data) => { socket.emit('sendUpdateEstimationType', data) })

bus.$on('sendAddEstimationType', (data) => { socket.emit('sendAddEstimationType', data) })

bus.$on('sendAddEstimationValue', (data) => { socket.emit('sendAddEstimationValue', data) })

bus.$on('sendDeleteEstimationValue', (data) => { socket.emit('sendDeleteEstimationValue', data) })

bus.$on('sendAddTeamMember', (data) => { socket.emit('sendAddTeamMember', data) })

bus.$on('sendIncludeTeamMember', (data) => { socket.emit('sendIncludeTeamMember', data) })

bus.$on('sendDeleteTeamMember', (data) => { socket.emit('sendDeleteTeamMember', data) })

bus.$on('sendAddTeam', (data) => { socket.emit('sendAddTeam', data) })

bus.$on('sendIncludeTeam', (data) => { socket.emit('sendAddTeam', data) })

bus.$on('sendDeleteTeam', (data) => { socket.emit('sendDeleteTeam', data) })

bus.$on('sendSetUseDiscussionTimer', (data) => { socket.emit('sendSetUseDiscussionTimer', data) })

bus.$on('sendSetUseEstimationTimer', (data) => { socket.emit('sendSetUseEstimationTimer', data) })

bus.$on('sendSetTimerAutoReveal', (data) => { socket.emit('sendSetTimerAutoReveal', data) })

bus.$on('sendSetVelocity', (data) => { socket.emit('sendSetVelocity', data) })

bus.$on('sendSetEstimationTimerTime', (data) => { socket.emit('sendSetEstimationTimerTime', data) })

bus.$on('sendSetDiscussionTimerTime', (data) => { socket.emit('sendSetDiscussionTimerTime', data) })


// --- Receive ---

// Game

socket.on('loadOrganisations', (data) => { bus.$emit('loadOrganisations', data) })

socket.on('loadOrganisation', (data) => { bus.$emit('loadOrganisation', data) })

socket.on('loadTeams', (data) => { bus.$emit('loadTeams', data) })

socket.on('loadTeam', (data) => { bus.$emit('loadTeam', data) })

socket.on('memberAction', (data) => { bus.$emit('memberAction', data) })

socket.on('updateEstimationType', (data) => { bus.$emit('updateEstimationType', data) })

socket.on('updateEstimateTeam', (data) => { bus.$emit('updateEstimateTeam', data) })

socket.on('updateTimer', (data) => { bus.$emit('updateTimer', data) })

socket.on('stopTimer', (data) => { bus.$emit('stopTimer', data) })

socket.on('reveal', (data) => { bus.$emit('reveal', data) })

socket.on('updateConnections', (data) => { bus.$emit('updateConnections', data) })

// Facilitator

socket.on('openEditPane', (data) => { bus.$emit('openEditPane', data) })

socket.on('backlogLoaded', (data) => { bus.$emit('backlogLoaded', data) })

socket.on('backlogSaved', (data) => { bus.$emit('backlogSaved', data) })



export default bus
