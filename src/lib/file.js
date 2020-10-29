
function lineToFields(line, sep) {
  let fields = []
  switch(sep) {
    case 'tab':
      fields = line.split('\t')
      break
    case 'comma':
      fields = line.split(/,/)
      break
    case 'space':
      fields = line.split(/\s/)
      break
  }
  return fields
}

function checkLine(fields) {
  return fields.length > 2
}

function fieldsToCard(fields) {
   return {
     id: fields[0],
     selected: false,
     estimate: 0,
     title: fields[1],
     description: fields[2]
   }
}

const FileFuns = {

  fileToCards: function(text, sep) {
    const cards = [], lines = text.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      const fields = lineToFields(lines[i], sep)
      if (checkLine(fields)) {
        cards.push(fieldsToCard(fields))
      }
    }
    return cards
  }
}

export default FileFuns
