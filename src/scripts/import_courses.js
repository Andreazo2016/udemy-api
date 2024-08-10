require('dotenv/config')
const udemy = require('../config/udemy_credentials')
const { db } = require('../config/db')

function mapFieldsToInsertFreeCourses(courses = []) {
  return courses.map(course => {
    return {
      course_id: course.id,
      title: course.title,
      description: course.headline,
      url: `https://www.udemy.com${course.url}`,
      image: course.image_240x135,
      language: course.locale.title,
      language_code: course.locale.locale,
      type: 'free',
      price: 0
    }
  })
}

function mapFieldsToInsertPaidCourses(courses = []) {
  return courses.map(course => {
    return {
      course_id: course.id,
      title: course.title,
      description: course.headline,
      url: `https://www.udemy.com${course.url}`,
      image: course.image_240x135,
      language: course.locale.title,
      language_code: course.locale.locale,
      type: 'paid',
      price: course.price_detail.amount,
      currency_code: course.price_detail.currency
    }
  })
}

async function getFreeCourses(page = 1) {
  try {
    const response = await fetch(`${udemy.api_url}/?page=${page}&page_size=100&price=price-paid`, {
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Authorization": udemy.credentials.basic_auth,
        "Content-Type": "application/json"
      }
    })
    const data = await response.json()
    return data
  } catch (ex) {
    console.log(ex)
    throw ex
  }
}


async function start() {
  let page = 1
  let hasNextPage = false 
  let { next, results } = await getFreeCourses(page)
  const fields = mapFieldsToInsertFreeCourses(results)
  await db('udemy_courses').insert(fields)
  hasNextPage = !!next
  while(hasNextPage) {
    console.log({ hasNextPage })
    page = page + 1
    console.log({ page })
    let { next: nextPage, results } = await getFreeCourses(page)
    const fields = mapFieldsToInsertFreeCourses(results)
    await db('udemy_courses').insert(fields)
    console.log(`Inserido: ${fields.length}`)
    hasNextPage = !!nextPage
  }
  console.log('finalizado')
  process.exit(0)
}
start()