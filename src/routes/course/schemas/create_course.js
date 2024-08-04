const schema = {
  type: 'object',
  properties: {
    course_id: { type: 'number' }
  },
  required: ['course_id']
}

module.exports = {
  body: schema
}