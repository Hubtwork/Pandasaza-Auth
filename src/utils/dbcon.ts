import maria from 'mysql'
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

}

export default connection