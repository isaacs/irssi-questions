var test = require('tap').test
var fs = require('fs')
var Questions = require('../questions.js')
var f = __dirname + '/fixtures'
var expectQm = fs.readFileSync(f + '/questions.txt', 'utf8')
    .replace(/\n+/g, '\n')
var expectQ = fs.readFileSync(f + '/questions-markless.txt', 'utf8')
    .replace(/\n+/g, '\n')

var log = fs.createReadStream(f + '/log.txt')
var qm = Questions()
var q = Questions({mark:false})

log.pipe(qm)
log.pipe(q)

var bufQm = []
var bufQ = []
q.on('data', bufQ.push.bind(bufQ))
qm.on('data', bufQ.push.bind(bufQm))


test('basic', function (t) {
  t.plan(2)

  q.on('end', function () {
    console.error('q')
    t.equal(bufQ.join('\n').replace(/\n+/g, '\n'), expectQ, 'markless')
  })

  qm.on('end', function () {
    console.error('qm')
    t.equal(bufQm.join('\n').replace(/\n+/g, '\n'), expectQm, 'with the qmarks')
  })
})
