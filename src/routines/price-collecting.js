const cron = require('node-cron')
const { db } = require('../config/db')
const QueueHelper = require('../helpers/queue')

const PATTERN = '* 1 * * *' //Running a job at 01:00 at America/Sao_Paulo timezone
let isJobRunning = false
const queueHelper = new QueueHelper('price_collecting_queue')

async function collectingPrice() {
  if (isJobRunning) {
    console.log('there is job running yet')
    return
  }
  const priceCollectingQueue = await queueHelper.createOrGetQueue()
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
    for (const course of courses) {
      priceCollectingQueue.publish({ course_id: course.course_id })
    }
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