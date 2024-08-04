function formatCourse(course) {
  return {
    course_id: course.id,
    title: course.title,
    description: course.headline,
    url: `https://www.udemy.com${course.url}`,
    image: course.image_240x135,
    language: course.locale.title,
    language_code: course.locale.locale,
    type: course.is_paid ? 'paid' : 'free',
    price: course.price_detail.amount,
    currency_code: course.price_detail.currency
  }
}

module.exports = formatCourse