import DbException from "../DbException";


export default class DBJoinException extends DbException {
    constructor() {
      super('JoinError', 'Database Join Exception occurred.')
    }
}