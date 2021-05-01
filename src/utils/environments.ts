require('dotenv').config()

export const server = {
  port: process.env.SERVER_PORT,
}

export const ncp_auth = {
  accessKey: process.env.NCP_API_KEY,
  secretKey: process.env.NCP_API_SECRET
}

export const sens = {
  phone: process.env.SENS_PHONE,
  clientId: process.env.SENS_CLIENT_ID
}

export const db = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
}