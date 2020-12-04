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

const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

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
      case 'setOrganisation':
        dbStore.setOrganisation(err, client, db, io, data, debugOn)
        break
      case 'loadTeam':
        dbStore.loadTeam(err, client, db, io, data, debugOn)
        break
      case 'setGameView':
        dbStore.setGameView(err, client, db, io, data, debugOn)
        break
      case 'updateBacklog':
        dbStore.updateBacklog(err, client, db, io, data, debugOn)
        break
      case 'selectCard':
        dbStore.selectCard(err, client, db, io, data, debugOn)
        break
      case 'updateCommittedCards':
        dbStore.updateCommittedCards(err, client, db, io, data, debugOn)
        break
      case 'startTimer':
        dbStore.startTimer(err, client, db, io, data, debugOn)
        break
      case 'updateEstimateValue':
        dbStore.updateEstimateValue(err, client, db, io, data, debugOn)
        break
      case 'updateAgreedEstimate':
        dbStore.updateAgreedEstimate(err, client, db, io, data, debugOn)
        break

      // Facilitator
      case 'addTeam':
        dbStore.addTeam(err, client, db, io, data, debugOn)
        break
      case 'includeTeam':
        dbStore.setTeamParameter(err, client, db, io, data, debugOn, 'include')
        break
      case 'setUseTimer':
        dbStore.setTeamParameter(err, client, db, io, data, debugOn, 'useTimer')
        break
      case 'setTimerAutoReveal':
        dbStore.setTeamParameter(err, client, db, io, data, debugOn, 'timerAutoReveal')
        break
      case 'setTimerTime':
        dbStore.setTeamParameter(err, client, db, io, data, debugOn, 'timerTime')
        break
      case 'deleteTeam':
        dbStore.deleteTeam(err, client, db, io, data, debugOn)
        break
      case 'addTeamMember':
        dbStore.addTeamMember(err, client, db, io, data, debugOn)
        break
      case 'includeTeamMember':
        dbStore.includeTeamMember(err, client, db, io, data, debugOn)
        break
      case 'deleteTeamMember':
        dbStore.deleteTeamMember(err, client, db, io, data, debugOn)
        break
      case 'updateEstimationType':
        dbStore.updateEstimationType(err, client, db, io, data, debugOn)
        break
      case 'addEstimationType':
        dbStore.addEstimationType(err, client, db, io, data, debugOn)
        break
      case 'addEstimationValue':
        dbStore.addEstimationValue(err, client, db, io, data, debugOn)
        break
      case 'deleteEstimationValue':
        dbStore.deleteEstimationValue(err, client, db, io, data, debugOn)
        break
      case 'setRelativeSizing':
        dbStore.setRelativeSizing(err, client, db, io, data, debugOn)
        break
      case 'loadBacklog':
        dbStore.loadBacklog(err, client, db, io, data, debugOn)
        break
      case 'saveBacklog':
        dbStore.saveBacklog(err, client, db, saveDir, logFile, io, data, fs, debugOn)
        break
      case 'addBacklogCard':
        dbStore.addBacklogCard(err, client, db, io, data, debugOn)
        break
      case 'deleteBacklogCard':
        dbStore.deleteBacklogCard(err, client, db, io, data, debugOn)
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
  socket.on('setOrganisation', (data) => { doDb('setOrganisation', data) })

  socket.on('loadTeam', (data) => { doDb('loadTeam', data) })

  socket.on('setGameView', (data) => { doDb('setGameView', data) })

  socket.on('updateEstimationType', (data) => { doDb('updateEstimationType', data) })

  socket.on('selectCard', (data) => { doDb('selectCard', data) })

  socket.on('updateCommittedCards', (data) => { doDb('updateCommittedCards', data) })

  socket.on('updateEstimateValue', (data) => { doDb('updateEstimateValue', data) })

  socket.on('startTimer', (data) => { doDb('startTimer', data) })

  socket.on('reveal', (data) => { emit('reveal', data) })

  socket.on('updateAgreedEstimate', (data) => { doDb('updateAgreedEstimate', data) })

  // Facilitator
  socket.on('addTeam', (data) => { doDb('addTeam', data) })

  socket.on('includeTeam', (data) => { doDb('includeTeam', data) })

  socket.on('setUseTimer', (data) => { doDb('setUseTimer', data) })

  socket.on('setTimerAutoReveal', (data) => { doDb('setTimerAutoReveal', data) })

  socket.on('setTimerTime', (data) => { doDb('setTimerTime', data) })

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

http.listen(port, () => {
  console.log('Listening on *:' + port)
})
