import DbException from "../DbException";


export default class DBJoinException extends DbException {
    constructor() {
      super('Database Join Exception occurred.')
    }
}