const crypto = require('crypto')

const sec  = 'test'
const hash = crypto.createHmac('sha256',sec).update("welcome").digest('hex')
console.log(hash)

const dechiper = crypto.createDecipheriv()
const decrypt = dechiper.update(hash ,'hex' ,'utf-8')