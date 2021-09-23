
const Member = {

  status: function(member) {
    let status = ''
    if (member.away) {
      status = 'away'
    } else if (member.coffee) {
      status = 'coffee'
    } else if (member.question) {
      status = 'question'
    } else if (member.voted) {
      status = 'voted'
    } else if (member.abstain) {
      status = 'abstain'
    } else {
      status = 'not-voted'
    }
    return status
  }
}

export default Member
