const { getConnection } = require('../services/rabbitmq')

class Queue {

  constructor(queuename) {
    this.queuename = queuename
  }

  async createOrGetQueue() {
    if (!this.queuename) {
      throw new Error('QueueName must be provided')
    }
    const connection = await getConnection()
    const channel = await connection.createChannel()
    await channel.assertQueue(this.queuename, {
      durrable: true
    })
    await channel.prefetch(5)
    return {
      publish: (message) => {
        channel.sendToQueue(this.queuename, Buffer.from(JSON.stringify(message)))
      },
      consume: (callback) => {
        channel.consume(this.queuename, (msg) => {
          const ack = () => {
            channel.ack(msg)
          }
          const nack = () => {
            channel.nack(msg)
          }
          callback(msg, ack, nack)
        })
      },
    }
  }

}

module.exports = Queue