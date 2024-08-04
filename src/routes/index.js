const courseRoutes = require('./course/index')

const registerRoutes = (fastify) => {
  fastify.register(courseRoutes, { prefix: '/api/v1' })
}

module.exports = registerRoutes