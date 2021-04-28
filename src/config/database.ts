
import EventEmitter = require('events')
import { createConnection } from 'typeorm';
import { AuthPhone } from '../entity/entity.auth.phone';
import { UserDetail } from '../entity/entity.userdetail';
import { db } from '../utils/environments'
import { Logger } from '../utils/logger';

class Database {

    public static emitter: EventEmitter = new EventEmitter()
    public static isConnected = false
    public static logger: any = new Logger()

    public static async getConnection(callback = null, wait = false) {
        this.handleConnectionError();
        return await Database.createConnection();
    }

    public static async createConnection() {
        return await createConnection({
          type: 'mysql',
          host: db.host,
          port: Number(db.port),
          username: db.user,
          password: db.password,
          database: db.database,
          entities: [
            AuthPhone,
            UserDetail
          ],
        }).then(() => {
          this.isConnected = true;
          this.logger.info('database connected successfully')
        }).catch((err: Error) => {
          this.logger.error('database connection error...retrying')
          this.emitter.emit('DB_CONNECT_ERROR')
        })
    }

    public static async handleConnectionError() {
        this.emitter.on('DB_CONNECT_ERROR', async () => {
        this.logger.log('info', 'database connection error...retrying');
        setTimeout(async () => {
            await this.createConnection()
            }, 3000)
        })
    }
    
}

export { Database }