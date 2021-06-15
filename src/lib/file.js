
import bus from '../socket.js'

const papa = require('papaparse')
const { v4: uuidv4 } = require('uuid')

function createBacklog(data, organisationId, teamId, replace) {
  const backlog = []
  for (let i = 0; i < data.length; i++) {
    const card = {
      id: uuidv4(),
      cardId: data[i][0],
      title: data[i][1],
      description: data[i][2],
      estimate: data[i][3] ? data[i][3] : '',
      selected: false
    }
    backlog.push(card)
  }
  console.log({organisationId: organisationId, teamId: teamId, backlog: backlog, replace: replace})

  bus.$emit('sendLoadBacklog', {organisationId: organisationId, teamId: teamId, backlog: backlog, replace: replace})
}

const FileFuns = {

  loadBacklog: function(file, separator, organisationId, teamId, replace) {

    switch(separator) {
      case 'tab':
        separator = '\t'
        break
      case 'comma':
        separator = ','
        break
      case 'semicolon':
        separator = ';'
        break
      case 'colon':
        separator = ':'
        break
      case 'space':
        separator = ' '
        break
    }
    const results = papa.parse(file, {
      delimiter: separator,
      skipEmptyLines: true,
	    complete: function(results) {
		    createBacklog(results.data, organisationId, teamId, replace)
	    }
    })
  }

}

export default FileFuns
