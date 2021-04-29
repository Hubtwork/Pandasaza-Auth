import { ConnectionOptions } from 'typeorm'
import { db } from './src/utils/environments'

const dbConnectionOptions: ConnectionOptions[] = [
    {
        name: "production",
        type: "mariadb",
        database: db.database,
        synchronize: false,
        logging: true,
        entities: ["dist/entities/**/*.ts"],
        subscribers: ["dist/subscribers/**/*.ts"],
        migrations: ["dist/migrations/**/*.ts"],
        migrationsTableName: "migrations",
        cli: {
            entitiesDir: "src/entities",
            subscribersDir: "src/subscribers",
            migrationsDir: "src/migrations"
        },
        host: db.host,
        port: Number(db.port),
        username: db.user,
        password: db.password
        },
    {
        name: "test",
        type: "mariadb",
        database: 'auth_test',
        synchronize: true,
        dropSchema: true,
        logging: false,
        entities: ["src/entities/**/*.ts"],
        subscribers: ["src/migrations/**/*.ts"],
        migrations: ["src/migrations/**/*.ts"],
        host: db.host,
        port: Number(db.port),
        username: db.user,
        password: db.password
    }
]

export = dbConnectionOptions