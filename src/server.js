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

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, client) {
  if (err) throw err
  const db = client.db('db')

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

    socket.on('sendCheckSystemWorkshops', () => { dbStore.checkSystemWorkshops(db, io, debugOn) })

    socket.on('loadOrganisation', (data) => { dbStore.loadOrganisation(db, io, data, debugOn) })

    socket.on('sendLoadTeam', (data) => { dbStore.loadTeam(db, io, data, debugOn) })

    socket.on('sendSetGameView', (data) => { dbStore.setGameView(db, io, data, debugOn) })

    socket.on('sendUpdateEstimationType', (data) => { dbStore.updateEstimationType(db, io, data, debugOn) })

    socket.on('sendUpdateBacklog', (data) => { dbStore.updateBacklog(db, io, data, debugOn) })

    socket.on('sendSelectCard', (data) => { dbStore.selectCard(db, io, data, debugOn) })

    socket.on('updateCommittedCards', (data) => { dbStore.updateCommittedCards(db, io, data, debugOn) })

    socket.on('sendMemberCoffee', (data) => { dbStore.memberCoffee(db, io, data, debugOn) })

    socket.on('sendMemberQuestion', (data) => { dbStore.memberQuestion(db, io, data, debugOn) })

    socket.on('sendUpdateEstimateValue', (data) => { dbStore.updateEstimateValue(db, io, data, debugOn) })

    socket.on('sendSetTimerType', (data) => { dbStore.setTimerType(db, io, data, debugOn) })

    socket.on('sendStartTimer', (data) => { dbStore.startTimer(db, io, data, debugOn) })

    socket.on('sendStopTimer', (data) => { dbStore.stopTimer(db, io, data, debugOn) })

    socket.on('sendReveal', (data) => { emit('reveal', data) })

    socket.on('sendUpdateAgreedEstimate', (data) => { dbStore.updateAgreedEstimate(db, io, data, debugOn) })

    // Facilitator

    socket.on('sendOpenEditPane', (data) => { emit('openEditPane', data) })

    socket.on('sendAddOrganisation', (data) => { dbStore.addOrganisation(db, io, data, debugOn) })

    socket.on('sendDeleteOrganisation', (data) => { dbStore.deleteOrganisation(db, io, data, debugOn) })

    socket.on('sendAddTeam', (data) => { dbStore.addTeam(db, io, data, debugOn) })

    socket.on('sendIncludeTeam', (data) => { dbStore.includeTeam(db, io, data, debugOn) })

    socket.on('sendDeleteTeam', (data) => { dbStore.deleteTeam(db, io, data, debugOn) })

    socket.on('sendSetVelocity', (data) => { dbStore.setVelocity(db, io, data, debugOn) })

    socket.on('sendSetUseEstimationTimer', (data) => { dbStore.setUseEstimationTimer(db, io, data, debugOn) })

    socket.on('sendSetUseEstimationTimer', (data) => { dbStore.setUseEstimationTimer(db, io, data, debugOn) })

    socket.on('sendSetUseDiscussionTimer', (data) => { dbStore.setUseDiscussionTimer(db, io, data, debugOn) })

    socket.on('sendSetTimerAutoReveal', (data) => { dbStore.setTimerAutoReveal(db, io, data, debugOn) })

    socket.on('sendSetEstimationTimerTime', (data) => { dbStore.setEstimationTimerTime(db, io, data, debugOn) })

    socket.on('sendSetDiscussionTimerTime', (data) => { dbStore.setDiscussionTimerTime(db, io, data, debugOn) })


    socket.on('sendAddTeamMember', (data) => { dbStore.addTeamMember(db, io, data, debugOn) })

    socket.on('sendIncludeTeamMember', (data) => { dbStore.includeTeamMember(db, io, data, debugOn) })

    socket.on('sendDeleteTeamMember', (data) => { dbStore.deleteTeamMember(db, io, data, debugOn) })

    socket.on('sendAddEstimationType', (data) => { dbStore.addEstimationType(db, io, data, debugOn) })

    socket.on('sendAddEstimationValue', (data) => { dbStore.addEstimationValue(db, io, data, debugOn) })

    socket.on('sendDeleteEstimationValue', (data) => { dbStore.deleteEstimationValue(db, io, data, debugOn) })

    socket.on('sendSetRelativeSizing', (data) => { dbStore.setRelativeSizing(db, io, data, debugOn) })

    socket.on('sendLoadBacklog', (data) => { dbStore.loadBacklog(db, io, data, debugOn) })

    socket.on('sendSaveBacklog', (data) => { dbStore.saveBacklog(db, io, data, debugOn) })

    socket.on('sendAddBacklogCard', (data) => { dbStore.addBacklogCard(db, io, data, debugOn) })

    socket.on('sendDeleteBacklogCard', (data) => { dbStore.deleteBacklogCard(db, io, data, debugOn) })
  })
})

const port = process.argv[2] || 3004

httpServer.listen(port, () => {
  console.log('Listening on *:' + port)
})
