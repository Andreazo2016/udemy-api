require('dotenv/config')
const Fastify = require('fastify')
const registerRoutes = require('./routes/index')
require('./routines/index')
require('./services/elasticsearch')

const fastify = Fastify({
  logger: true
})
registerRoutes(fastify)

fastify.get('/health', (_, res) => {
  return res.status(200).send({ ok: true })
})

fastify.listen(process.env.PORT, (err) => {
  if(err) {
    console.log(err)
    process.exit(1)
  }
  console.log(`Server running at http://localhost:${process.env.PORT}`)
})