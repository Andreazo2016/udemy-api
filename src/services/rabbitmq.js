const amqp = require('amqplib')

const getConnection = async () => {
  try {
    const connection = amqp.connect({
      host: process.env.AMQP_HOST,
      port: process.env.AMQP_PORT,
      username: process.env.AMQP_USER,
      password: process.env.AMQP_PASSWORD,
    })
    return connection
  } catch (ex) {
    console.log('Problem to connect to RabbitMQ')
    console.log(ex)
    throw ex
  }
}

module.exports = {
  getConnection
}
