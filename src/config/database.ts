
import EventEmitter = require('events')
import { createConnection, getConnectionOptions, getConnection } from 'typeorm';
import { AuthPhone } from '../entities/entity.auth.phone';
import { UserDetail } from '../entities/entity.userdetail';
import { db } from '../utils/environments'
import { Logger } from '../utils/logger';

class Database {

    public static emitter: EventEmitter = new EventEmitter()
    public static isConnected = false
    public static logger: any = new Logger()

    public static async getConnection(callback = null, wait = false) {
        this.handleConnectionError()
        return await Database.createConnection()
    }

    public static async closeConnection() {
        await getConnection().close()
    }

    private static async createConnection() {
        const connectionOption = await getConnectionOptions(process.env.NODE_ENV)
        this.logger.info(JSON.stringify(connectionOption))
        return await createConnection({...connectionOption, name: 'default'})
        .then(() => {
          this.isConnected = true;
          this.logger.info('database connected successfully')
        }).catch((err: Error) => {
          this.logger.error('database connection error...retrying')
          this.emitter.emit('DB_CONNECT_ERROR')
        })
    }

    private static async handleConnectionError() {
        this.emitter.on('DB_CONNECT_ERROR', async () => {
            this.logger.log('info', 'database connection error...retrying')
            setTimeout(async () => {
                await this.createConnection()
                }, 3000)
        })
    }
    
}

export { Database }