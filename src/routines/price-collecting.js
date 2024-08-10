const cron = require('node-cron')
const { db } = require('../config/db')
const UdemyService = require('../services/udemy')
const formatCourse = require('../helpers/format_course')

const PATTERN = '* 1 * * *' //Running a job at 01:00 at America/Sao_Paulo timezone
let isJobRunning = false

async function collectingPrice() {
  if (isJobRunning) {
    console.log('there is job running yet')
    return
  }
  const limit = 10
  const [{ total }] =  await db('udemy_courses').count('id', { as: 'total' }).where({
    type: 'paid'
  })
  const totalPage = Math.floor(total/limit)
  isJobRunning = true
  for (let page = 0; page < totalPage; page++) {
    const courses = await db('udemy_courses')
    .select(['id', 'course_id'])
    .where({ type: 'paid' })
    .limit(limit)
    .offset(page * limit)
    let toInsert = []
    for (const course of courses) {
      const response = await UdemyService.getCourse(course.course_id)
      const formattedCourse = formatCourse(response)
      const data = {
        date: new Date(),
        price: formattedCourse.price,
        udemy_course_id: course.id
      }
      toInsert.push(data)
    }
    await db('udemy_course_prices').insert(toInsert)
  }
  isJobRunning = false
}


cron.schedule(PATTERN, () => {
  console.log('STARTING COLLECTING')
  collectingPrice()
  .catch(ex => console.log(ex))
}, {
  timezone: 'America/Sao_Paulo'
})


module.exports = cron