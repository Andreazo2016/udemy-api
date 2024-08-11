require('dotenv/config')
const { db } = require('../config/db')

function parseJSON(course) {
  try {
    return JSON.stringify({
      rating: course.rating,
      num_subscribers: course.num_subscribers,
      created: course.created,
      instructors: course.visible_instructors?.map(vi => {
        return {
          id: vi.id,
          name: vi.title,
          profile_photo: vi.image_100x100,
          profile_url:`https://www.udemy.com${vi.url}`
        }
      })
    })
  } catch (ex) {
    return JSON.stringify({})
  }
}
function mapCourseFields(courses = [], db_label_id) {
  return courses.map(course => {
    return {
      course_id: course.id,
      title: course.title,
      description: course.headline,
      url: `https://www.udemy.com${course.url}`,
      image: course.image_240x135,
      language: course.locale.title,
      language_code: course.locale.locale,
      type: course.is_paid ? 'paid': 'free',
      price: null,
      currency_code: null,
      label_id: db_label_id,
      meta: parseJSON(course)
    }
  })
}

async function getCourses(label_id, page = 1, limit = 50) {
  try {
    const response = await fetch(`https://www.udemy.com/api-2.0/discovery-units/all_courses/?p=${page}&page_size=${limit}&label_id=${label_id}&source_page=topic_page&locale=pt_BR&currency=brl&navigation_locale=pt&sos=pl&fl=lbl`)
    const data = await response.json()
    return data
  } catch (ex) {
    console.log(ex)
    throw ex
  }
}

async function processItems(items = [], db_label_id) {
  const mappedItems = mapCourseFields(items, db_label_id)
  console.log(`mappedItems ${mappedItems.length}`)
  for (const item of mappedItems) {
    try {
      console.log(`${item.course_id} - ${item.title}`)
      const [result] = await db('udemy_courses').select('id').where({
        course_id: item.course_id
      })
      console.log({ result })
      if (result) {
        console.log(`the course alrady inserted - ${item.course_id} - ${item.title}`)
      } else {
        await db('udemy_courses').insert([item])
        console.log(`inserted - ${item.course_id} - ${item.title}`)
      }
    } catch (ex) {
      console.log(ex)
      console.log(`problem to save ${item.course_id}`)
    }
  }
}


async function start({ label_id, db_label_id }) {

  const { unit: { pagination } } = await getCourses(label_id)
  console.log(`total items: ${pagination.total_item_count}`)
  console.log(`total pages: ${pagination.total_page}`)

  for(let page = 1; page <= pagination.total_page; page++) {
    console.log(`$current page ${page} of ${pagination.total_page}`)
    const { unit } = await getCourses(label_id, page)
    console.log(`units ${unit.items.length}`)
    await processItems(unit.items, db_label_id)
    .catch(ex => {
      console.log(ex)
      console.log('PROBLEM TO INSERT ITEMS')
    })
  }
 
}


async function run() {
  const labels = await db('udemy_course_labels').select(['id','label_id', 'title'])
  for (const {id, title, label_id } of labels) {
    console.log(`buscando ${title}`)
    await start({ db_label_id: id, label_id })
  }
}
run()