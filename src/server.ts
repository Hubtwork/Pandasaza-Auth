import 'dotenv/config'
 
import { Logger } from './utils/logger'
import APP from './app'

const logger = new Logger()

const App = new APP()
const dbconnect = ( async () => {
    await App.attatchDBConnection()
    App.serverOn()
})
dbconnect()