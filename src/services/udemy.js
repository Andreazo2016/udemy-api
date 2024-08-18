const udemy = require('../config/udemy_credentials')
const Logger = require('../helpers/logger')

class UdemyService {

  static async getCourse(id) {
    if(!id) {
      throw new Error('id of course is required')
    }
    try {
      const response = await fetch(`${udemy.api_url}/${id}`, {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Authorization": udemy.credentials.basic_auth,
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      return data
    } catch (ex) {
      Logger.error({
        error: ex,
        type_event:'FetchCourseServiceUdemy',
        body: {
          course_id: id
        }
      })
      throw ex
    }
  }

  static async getFreeCourses({
    page = 1,
    limit = 10,
  }) {
    try {
      const response = await fetch(`${udemy.api_url}/?page=${page}&page_size=${limit}`, {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Authorization": udemy.credentials.basic_auth,
          "Content-Type": "application/json"
        }
      })
      const data = await response.json()
      return data
    } catch (ex) {
      Logger.error({
        error: ex,
        type_event:'FetchAllCourseServiceUdemy',
      })
      throw ex
    }
  }
}

module.exports = UdemyService