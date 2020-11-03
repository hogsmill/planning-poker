
const papa = require('papaparse')

function createBacklog(data, teamName, replace, socket) {
  const backlog = []
  for (let i = 0; i < data.length; i++) {
    const card = {
      id: data[i][0],
      title: data[i][1],
      description: data[i][2],
      estimate: data[i][3] ? data[i][3] : '',
      selected: false
    }
    backlog.push(card)
  }
  socket.emit('loadBacklog', {teamName: teamName, backlog: backlog, replace: replace})
}

const FileFuns = {

  loadBacklog: function(file, separator, teamName, replace, socket) {

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
		    createBacklog(results.data, teamName, replace, socket)
	    }
    })
  }

}

export default FileFuns
