import { Database } from "../config/database"
import { Logger } from "../utils/logger"

const logger = new Logger()

beforeAll( async (done) => {
    if (Database.isConnected = true) {
        await Database.getConnection().then(() => {
            logger.info('DB ON')
            done()
        })
    }
})

afterAll( async (done) => {
    if (Database.isConnected = true) {
        await Database.closeConnection().then(() => {
            logger.info('DB OFF')
            done()
        })
    }
})