require('dotenv').config()
const app = require('./app')
const { redis } = require('./config/redis')
const http = require('http')
const { WebSocketServer } = require('ws')
const jwt = require('jsonwebtoken')
const { clients } = require('./config/websocket')
const { scheduleSurgeUpdate } = require('./jobs/surge.job')
const { surgeWorker } = require('./jobs/worker')


const PORT = process.env.PORT || 3000

async function startServer() {
  await redis.connect()
  await scheduleSurgeUpdate()
  console.log('connected to redis')

  const server = http.createServer(app)
  const wss = new WebSocketServer({ server })
  const heartbeat = setInterval(() => {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        clients.forEach((value, key) => {
          if (value === ws) clients.delete(key)
        })
        return ws.terminate()
      }
      ws.isAlive = false
      ws.ping()
    })
  }, 10000)

  wss.on('close', () => clearInterval(heartbeat))

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection')
    ws.isAlive = true
    ws.on('pong', () => { ws.isAlive = true })

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message)

        if (data.type === 'auth') {
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET)
          clients.set(decoded.userId, ws)
          ws.send(JSON.stringify({ type: 'auth', status: 'success' }))
          console.log(`User ${decoded.userId} connected via WebSocket`)
        }

        if (data.type === 'location') {
          clients.set(data.userId, ws)
        }
      } catch (error) {
        ws.send(JSON.stringify({ type: 'error', message: error.message }))
      }
    })

    ws.on('close', () => {
      clients.forEach((value, key) => {
        if (value === ws) clients.delete(key)
      })
    })
  })

  server.listen(PORT, () => {
    console.log(`SwiftRide server is running on port ${PORT}`)
  })
}

startServer()

