import JWTException from "../JWTException";


export default class AccessTokenExpiredException extends JWTException {
    constructor() {
      super('AccessTokenExpired', 'Access Token Expired')
    }
}