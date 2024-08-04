const CourseController = require('../../controllers/course')
const createCourseSchema = require('./schemas/create_course')
const courseController = new CourseController()

const courseRoutes = (fastify, _, done) => {
  fastify.post('/courses', { schema: createCourseSchema }, courseController.create.bind(courseController))
  done()
}

module.exports = courseRoutes