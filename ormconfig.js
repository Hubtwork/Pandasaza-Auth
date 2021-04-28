import { db } from './src/utils/environments'

export default {
    'name': 'auth',
    'type': 'mysql',
    'host': db.host,
    'database': db.database,
    'username': db.user,
    'password': db.password,
    'syncronize': true,
    'entities': [
        'src/entity/**/*.ts'
    ]
}