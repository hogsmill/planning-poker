const fs = require('fs')
const ON_DEATH = require('death')({uncaughtException: true})
const os = require('os')

const prod = os.hostname() == 'agilesimulations' ? true : false
const logFile = prod ? process.argv[4] : 'server.log'

ON_DEATH(function(signal, err) {
  let logStr = new Date()
  if (signal) {
    logStr = logStr + ' ' + signal + '\n'
  }
  if (err && err.stack) {
    logStr = logStr + '  ' + err.stack + '\n'
  }
  fs.appendFile(logFile, logStr, function (err) {
    if (err) console.log(logStr)
    process.exit()
  })
})

let httpServer
let io
if (!prod) {
  const express = require('express')
  const app = express()
  httpServer = require('http').createServer(app)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['http://localhost:*'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
} else {
  const options = {
    key: fs.readFileSync('/etc/ssl/private/agilesimulations.co.uk.key'),
    cert: fs.readFileSync('/etc/ssl/certs/07DDA10F5A5AB75BD9E9508BC490D32C.cer')
  }
  httpServer = require('https').createServer(options)
  io = require('socket.io')(httpServer, {
    cors: {
      origins: ['https://agilesimulations.co.uk'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  })
}

const dbStore = require('./store/dbStore.js')

const MongoClient = require('mongodb').MongoClient

const url = prod ? 'mongodb://127.0.0.1:27017/' : 'mongodb://localhost:27017/'
const saveDir = prod ? '/var/www/html/planning-poker/backlogs/' : 'C:/DATA/APPS/planning-poker/backlogs/'

const connectDebugOff = prod
const debugOn = !prod

const connections = {}
const maxConnections = 500

function emit(event, data) {
  if (debugOn) {
    console.log(event, data)
  }
  io.emit(event, data)
}

function doDb(fun, data) {
  MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
    if (err) throw err
    const db = client.db('db')

    switch(fun) {

      // Game
      case 'checkSystemWorkshops':
        dbStore.checkSystemWorkshops(db, io, debugOn)
        break
      case 'loadOrganisation':
        dbStore.loadOrganisation(db, io, data, debugOn)
        break
      //case 'setOrganisation':
      //  dbStore.setOrganisation(db, io, data, debugOn)
      //  break
      case 'loadTeam':
        dbStore.loadTeam(db, io, data, debugOn)
        break
      case 'setGameView':
        dbStore.setGameView(db, io, data, debugOn)
        break
      case 'updateBacklog':
        dbStore.updateBacklog(db, io, data, debugOn)
        break
      case 'selectCard':
        dbStore.selectCard(db, io, data, debugOn)
        break
      case 'updateCommittedCards':
        dbStore.updateCommittedCards(db, io, data, debugOn)
        break
      case 'setTimerType':
        dbStore.setTimerType(db, io, data, debugOn)
        break
      case 'startTimer':
        dbStore.startTimer(db, io, data, debugOn)
        break
      case 'updateEstimateValue':
        dbStore.updateEstimateValue(db, io, data, debugOn)
        break
      case 'memberCoffee':
        dbStore.setMemberValue(db, io, data, debugOn, 'coffee')
        break
      case 'memberQuestion':
        dbStore.setMemberValue(db, io, data, debugOn, 'question')
        break
      case 'updateAgreedEstimate':
        dbStore.updateAgreedEstimate(db, io, data, debugOn)
        break

      // Facilitator
      case 'addOrganisation':
        dbStore.addOrganisation(db, io, data, debugOn)
        break
      case 'deleteOrganisation':
        dbStore.deleteOrganisation(db, io, data, debugOn)
        break
      case 'addTeam':
        dbStore.addTeam(db, io, data, debugOn)
        break
      case 'includeTeam':
        dbStore.setTeamParameter(db, io, data, debugOn, 'include')
        break
      case 'setUseEstimationTimer':
        dbStore.setTeamParameter(db, io, data, debugOn, 'useEstimationTimer')
        break
      case 'setUseDiscussionTimer':
        dbStore.setTeamParameter(db, io, data, debugOn, 'useDiscussionTimer')
        break
      case 'setTimerAutoReveal':
        dbStore.setTeamParameter(db, io, data, debugOn, 'timerAutoReveal')
        break
      case 'setEstimationTimerTime':
        dbStore.setTeamParameter(db, io, data, debugOn, 'estimationTimerTime')
        break
      case 'setDiscussionTimerTime':
        dbStore.setTeamParameter(db, io, data, debugOn, 'discussionTimerTime')
        break
      case 'setVelocity':
        dbStore.setTeamParameter(db, io, data, debugOn, 'velocity')
        break
      case 'deleteTeam':
        dbStore.deleteTeam(db, io, data, debugOn)
        break
      case 'addTeamMember':
        dbStore.addTeamMember(db, io, data, debugOn)
        break
      case 'includeTeamMember':
        dbStore.includeTeamMember(db, io, data, debugOn)
        break
      case 'deleteTeamMember':
        dbStore.deleteTeamMember(db, io, data, debugOn)
        break
      case 'updateEstimationType':
        dbStore.updateEstimationType(db, io, data, debugOn)
        break
      case 'addEstimationType':
        dbStore.addEstimationType(db, io, data, debugOn)
        break
      case 'addEstimationValue':
        dbStore.addEstimationValue(db, io, data, debugOn)
        break
      case 'deleteEstimationValue':
        dbStore.deleteEstimationValue(db, io, data, debugOn)
        break
      case 'setRelativeSizing':
        dbStore.setRelativeSizing(db, io, data, debugOn)
        break
      case 'loadBacklog':
        dbStore.loadBacklog(db, io, data, debugOn)
        break
      case 'saveBacklog':
        dbStore.saveBacklog(db, saveDir, logFile, io, data, fs, debugOn)
        break
      case 'addBacklogCard':
        dbStore.addBacklogCard(db, io, data, debugOn)
        break
      case 'deleteBacklogCard':
        dbStore.deleteBacklogCard(db, io, data, debugOn)
        break
      default:
        console.log('Unknown function ', fun)
    }
  })
}

io.on('connection', (socket) => {
  const connection = socket.handshake.headers.host
  connections[connection] = connections[connection] ? connections[connection] + 1 : 1
  if (Object.keys(connections).length > maxConnections || connections[connection] > maxConnections) {
    console.log(`Too many connections. Socket ${socket.id} closed`)
    socket.disconnect(0)
  } else {
    connectDebugOff || console.log(`A user connected with socket id ${socket.id} from ${connection} - ${connections[connection]} connections. (${Object.keys(connections).length} clients)`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  }

  socket.on('disconnect', () => {
    const connection = socket.handshake.headers.host
    connections[connection] = connections[connection] - 1
    connectDebugOff || console.log(`User with socket id ${socket.id} has disconnected.`)
    emit('updateConnections', {connections: connections, maxConnections: maxConnections})
  })

  // Game
  socket.on('checkSystemWorkshops', () => { doDb('checkSystemWorkshops') })

  socket.on('loadOrganisation', (data) => { doDb('loadOrganisation', data) })

  //socket.on('setOrganisation', (data) => { doDb('setOrganisation', data) })

  socket.on('loadTeam', (data) => { doDb('loadTeam', data) })

  socket.on('setGameView', (data) => { doDb('setGameView', data) })

  socket.on('updateEstimationType', (data) => { doDb('updateEstimationType', data) })

  socket.on('selectCard', (data) => { doDb('selectCard', data) })

  socket.on('updateCommittedCards', (data) => { doDb('updateCommittedCards', data) })

  socket.on('memberCoffee', (data) => { doDb('memberCoffee', data) })

  socket.on('memberQuestion', (data) => { doDb('memberQuestion', data) })

  socket.on('updateEstimateValue', (data) => { doDb('updateEstimateValue', data) })

  socket.on('setTimerType', (data) => { doDb('setTimerType', data) })

  socket.on('startTimer', (data) => { doDb('startTimer', data) })

  socket.on('reveal', (data) => { emit('reveal', data) })

  socket.on('updateAgreedEstimate', (data) => { doDb('updateAgreedEstimate', data) })

  // Facilitator

  socket.on('openEditPane', (data) => { emit('openEditPane', data) })

  socket.on('addOrganisation', (data) => { doDb('addOrganisation', data) })

  socket.on('deleteOrganisation', (data) => { doDb('deleteOrganisation', data) })

  socket.on('addTeam', (data) => { doDb('addTeam', data) })

  socket.on('includeTeam', (data) => { doDb('includeTeam', data) })

  socket.on('setVelocity', (data) => { doDb('setVelocity', data) })

  socket.on('setUseEstimationTimer', (data) => { doDb('setUseEstimationTimer', data) })

  socket.on('setUseDiscussionTimer', (data) => { doDb('setUseDiscussionTimer', data) })

  socket.on('setTimerAutoReveal', (data) => { doDb('setTimerAutoReveal', data) })

  socket.on('setEstimationTimerTime', (data) => { doDb('setEstimationTimerTime', data) })

  socket.on('setDiscussionTimerTime', (data) => { doDb('setDiscussionTimerTime', data) })

  socket.on('deleteTeam', (data) => { doDb('deleteTeam', data) })

  socket.on('addTeamMember', (data) => { doDb('addTeamMember', data) })

  socket.on('includeTeamMember', (data) => { doDb('includeTeamMember', data) })

  socket.on('deleteTeamMember', (data) => { doDb('deleteTeamMember', data) })

  socket.on('addEstimationType', (data) => { doDb('addEstimationType', data) })

  socket.on('addEstimationValue', (data) => { doDb('addEstimationValue', data) })

  socket.on('deleteEstimationValue', (data) => { doDb('deleteEstimationValue', data) })

  socket.on('setRelativeSizing', (data) => { doDb('setRelativeSizing', data) })

  socket.on('loadBacklog', (data) => { doDb('loadBacklog', data) })

  socket.on('saveBacklog', (data) => { doDb('saveBacklog', data) })

  socket.on('updateBacklog', (data) => { doDb('updateBacklog', data) })

  socket.on('addBacklogCard', (data) => { doDb('addBacklogCard', data) })

  socket.on('deleteBacklogCard', (data) => { doDb('deleteBacklogCard', data) })
})

const port = process.argv[2] || 3004

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
