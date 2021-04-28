import { Database } from "../../src/config/database";


beforeAll(async () => {
    await Database.getConnection()
})

afterAll(async () => {
    await Database.closeConnection()
})