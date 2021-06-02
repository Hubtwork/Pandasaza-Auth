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

export const jwt = {
  access_key: process.env.ACCESS_TOKEN_SECRET,
  access_life: process.env.ACCESS_TOKEN_LIFE,
  refresh_key: process.env.REFRESH_TOKEN_SECRET,
  refresh_life: process.env.REFRESH_TOKEN_LIFE
}

export const objectstorage = {
  accessKey: process.env.NCP_OS_KEY,
  secretKey: process.env.NCP_OS_SECRET,
  endpoint: process.env.NCP_OS_ENDPOINT,
  region: process.env.NCP_OS_REGION,

  imageBucket: process.env.NCP_OS_IMAGE_BUCKET,
  profileImageDir: process.env.NCP_OS_PROFILE_IMAGE
}