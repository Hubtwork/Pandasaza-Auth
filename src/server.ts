import { server } from './utils/environments'
import 'dotenv/config'

import AuthController from './app/controllers/controller.auth'
import SmsController from './app/controllers/controller.sms'
import { Logger } from './utils/logger'
import APP from './app'

/*
const app = new App()

const dbconnect = ( async () => {
    await app.attatchDBConnection()
    app.attatchControllers([
        new SmsController(),
        new AuthController()
    ])
    app.listen()
})
dbconnect()
*/

const logger = new Logger()

const App = new APP()
const dbconnect = ( async () => {
    await App.attatchDBConnection()
    App.serverOn()
})
dbconnect()