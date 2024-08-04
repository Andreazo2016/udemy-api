const udemy = {
  api_url: process.env.UDEMY_API_URL,
  credentials: {
    client_id: process.env.UDEMY_CLIENT_API,
    secret_id: process.env.UDEMY_SECRET_API,
    basic_auth: process.env.UDEMY_BASIC_AUTH,
  }
}

module.exports = udemy