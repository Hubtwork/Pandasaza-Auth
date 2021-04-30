import { Database } from '../../src/config/database'

jest.setTimeout(3 * 60 * 1000)

beforeAll( async (done) => {
    if (Database.isConnected = true) {
        await Database.getConnection().then(() => {
            console.log('DB ON')
            done()
        })
    }
})

afterAll( async (done) => {
    if (Database.isConnected = true) {
        await Database.closeConnection().then(() => {
            console.log('DB OFF')
            done()
        })
    }
})