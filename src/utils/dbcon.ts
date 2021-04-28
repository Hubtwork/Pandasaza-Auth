import maria, { Query } from 'mysql'
import DbException from '../exceptions/DbException'
import { DbRequest } from '../types/return_types'
import { db } from './environments'
import { createConnection } from 'typeorm'

const connection = maria.createConnection({
    host: db.host,
    port: Number(db.port),
    database: db.database,
    user: db.user,
    password: db.password
})

export async function connectDB() {
    await createConnection()
}

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
        })
        this.disconnectDB()
    }

    public async query<T>(query: string): Promise<DbRequest<T>> {
        try {
            const resultArr = await this.createQuery<T>(query)
            console.log(`${resultArr}, type: ${typeof resultArr} / ${typeof resultArr[0]}`)
            return {
                isSuccess: true,
                data: resultArr
            }
        } catch (error) {
            return {
                isSuccess: false,
                error: error.message
            }
        }
    }

    private createQuery<T>(query: string): Promise<[T]> {
        //this.connectDB()
        return new Promise<[T]>((resolve, reject) => {
            this.connection.query(query, (err, rows) => {
                // error handling
                if (err) reject(new DbException(err.message))
                // resolve
                const jsonString = JSON.stringify(rows)
                const jsonRow = JSON.parse(jsonString)
                resolve(jsonRow as [T])
            })
        })
    }
}

export default connection