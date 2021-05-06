import HttpException from "../HttpException";

export default class AuthentificationFailedException extends HttpException {
    constructor() {
      super(401, 'Authentification Failed')
    }
}