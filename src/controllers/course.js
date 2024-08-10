const HttpStatus = require('http-status')
const UdemyService = require('../services/udemy')
const formatCourse = require('../helpers/format_course')
const { db } = require('../config/db')


class CourseController {

  async create(req, res) {
    try {
      const { course_id } = req.body
      
      const [result] = await db('udemy_courses').select('id').where({
        course_id
      })
      if (result) {
        return res.status(HttpStatus.BAD_REQUEST).send({
          message: 'course already created'
        })
      }
      const response = await UdemyService.getCourse(course_id)
      const course = formatCourse(response)
      await db('udemy_courses').insert([course])
      return res.status(HttpStatus.CREATED).send()
    } catch (ex) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        message: 'Internal Server Error'
      })
    }
  }
}

module.exports = CourseController