const { randomUUID } = require('crypto')
const elasticsearch = require('../services/elasticsearch')

class Logger {
  static tracking({ event_name = null, method = null, type_event = null, body = null }) {
    if (!event_name || typeof event_name !== 'string') {
      throw new Error('Event Name must be a string')
    }
    if (!type_event || typeof type_event !== 'string') {
      throw new Error('Type Name must be a string')
    }
    if (!body || typeof body !== 'object') {
      throw new Error('Body must be a object')
    }

    if (!method || typeof method !== 'string') {
      throw new Error('Body must be a string')
    }
    elasticsearch.index({
      index: process.env.ELASTICSEARCH_LOG_INDEX,
      id: randomUUID(),
      document: {
        event_name,
        type_event,
        type: 'Tracking',
        content: {
          ...body
        }
      }
    }).catch(ex => console.log(ex))
  }

  static error({ error = null, type_event = null, method = null, body = null }) {
    if (!error || !(error instanceof Error)) {
      throw new Error('errormust be Error')
    }
    if (!type_event || typeof type_event !== 'string') {
      throw new Error('Type Name must be a string')
    }
    if (!method || typeof method !== 'string') {
      throw new Error('Body must be a string')
    }
    elasticsearch.index({
      index: process.env.ELASTICSEARCH_LOG_INDEX,
      id: randomUUID(),
      document: {
        type_event,
        type: 'Error',
        error: {
          message: error.message,
          stack: JSON.stringify(error.stack ?? '')
        },
        content: {
          ...(body ?? {})
        }
      }
    }).catch(ex => console.log(ex))
  }
}

module.exports = Logger