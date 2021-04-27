import maria, { Query } from 'mysql'
import DbException from '../exceptions/DbException'
import { DbRequest } from '../types/return_types'
import { db } from './environments'

const connection = maria.createConnection({
    host: db.host,
    port: Number(db.port),
    database: db.database,
    user: db.user,
    password: db.password
})

export class MariaDBConnection {

    private connection: maria.Connection

    constructor() {
        this.connection = maria.createConnection({
            host: db.host,
            port: Number(db.port),
            database: db.database,
            user: db.user,
            password: db.password
        })
    }

    private connectDB() { this.connection.connect() }
    private disconnectDB() { this.connection.end() }

    public queryDB(query: string) {
        this.connectDB()
        
        this.connection.query(query, function(err, rows, fields) {
            if (err) throw err
            console.log(`rows : ${JSON.stringify(rows)}`)
            console.log(``)
            console.log(`fields : ${JSON.stringify(fields)}`)
        })
        this.disconnectDB()
    }

    public async query<T>(query: string): Promise<DbRequest<T>> {
        try {
            const val = await this.createQuery<T>(query)
            return {
                isSuccess: true,
                data: val
            }
        } catch (error) {
            return {
                isSuccess: false,
                error: error.message
            }
        }
    }

    private createQuery<T>(query: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.connection.query(query, (err, rows) => {
                // error handling
                if (err) reject(new DbException(err.message))
                // resolve
                resolve(rows as T)
            })
        })
    }
}

export default connection