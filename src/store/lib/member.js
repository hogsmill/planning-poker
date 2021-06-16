
module.exports = {

  clear: function(member) {
    member.abstain = false
    member.coffee = false
    member.estimate = null
    member.question = false
    member.voted = false

    return member
  }
}
