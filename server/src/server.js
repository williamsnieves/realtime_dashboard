import express from 'express'
import { json, urlencoded } from 'body-parser'
import morgan from 'morgan'
import config from './config'
import cors from 'cors'

// import { connect } from './utils/db'
const dotenv = require('dotenv')
dotenv.config()
export const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Twit = require('Twit')

console.log('TWIT_CONSUMER_KEY:', process.env.TWIT_CONSUMER_KEY)
console.log('TWIT_CONSUMER_SECRET:', process.env.TWIT_CONSUMER_SECRET)
console.log('TWIT_ACCESS_TOKEN:', process.env.TWIT_ACCESS_TOKEN)
console.log('TWIT_ACCESS_TOKEN_SECRET:', process.env.TWIT_ACCESS_TOKEN_SECRET)

const TwitterWrapper = new Twit({
  consumer_key: process.env.TWIT_CONSUMER_KEY,
  consumer_secret: process.env.TWIT_CONSUMER_SECRET,
  access_token: process.env.TWIT_ACCESS_TOKEN,
  access_token_secret: process.env.TWIT_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000 // optional HTTP request timeout to apply to all requests.
})

app.disable('x-powered-by')
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/hello', (req, res) => {
  res.json({ message: 'hello node' })
})

io.on('connection', socket => {
  console.log('client connected!')

  const streamResponseTwit = TwitterWrapper.stream('statuses/filter', {
    track: 'mango'
  })
  streamResponseTwit.on('tweet', tweet => {
    io.emit('tweet', { tweet })
  })
  io.emit('greetings', { hello: 'hello sockat!' })
  socket.on('disconnect', () => {
    console.log('socket closed!')
  })
})

export const start = async () => {
  try {
    // await connect()
    server.listen(config.port, () => {
      console.log(`REST API on http://localhost:${config.port}`)
    })
  } catch (e) {
    console.error(e)
  }
}
