// irssi log question-finder stream.
//
// feed in lines like:
//   05:56 < rvagg> Nexxy: what are the "wonderfuls"?
// and it'll spit out just the question part:
//   what are the "wonderfuls"?

var Stream = require('stream')

module.exports = Questions
Questions.prototype = Object.create(Stream.prototype, {
  constructor: { value: Questions, configurable: true }
})

function Questions (o) {
  o = o || {}
  if (!(this instanceof Questions)) return new Questions(o)
  Stream.apply(this)
  this.readable = true
  this.writable = true
  this.mark = o.mark === false ? false : true
  this._buffer = []
  this._length = 0
  this._paused = false
}

Questions.prototype.pause = function () {
  this._paused = true
}

Questions.prototype.resume = function () {
  this._paused = false
  this._process()
}

Questions.prototype.write = function (c) {
  this._buffer.push(c)
  this._length += c.length
  if (this._paused) return false
  this._process()
  return true
}

Questions.prototype.end = function (c) {
  this._ended = true
  if (c) this.write(c)
  else this._process()
}

Questions.prototype.close = Questions.prototype.destroy = function () {}

Questions.prototype._process = function () {
  if (!this._length || !this._buffer.length) {
    return
  }
  var lines = Buffer.concat(this._buffer, this._length).toString().split('\n')
  this._buffer.length = 0
  var save = lines.pop()
  if (save.length && !this._ended) {
    this._buffer.push(new Buffer(save))
  }
  lines.forEach(function (line) {
    var match = line.match(/^[0-9]{2}:[0-9]{2} <[^>]+> (?:[^:]+: )?(.*)\?$/)
    if (!match) return
    var m = match[1].trim()
    if (this.mark !== false) m += '?'
    this.emit('data', m + '\n')
  }.bind(this))
  if (this._ended) this.emit('end')
  else this.emit('drain')
}
