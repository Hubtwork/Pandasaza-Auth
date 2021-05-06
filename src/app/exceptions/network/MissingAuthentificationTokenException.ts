import HttpException from "../HttpException";


export default class MissingAuthentificationTokenException extends HttpException {
    constructor() {
      super(401, 'Missing Authentification token')
    }
}