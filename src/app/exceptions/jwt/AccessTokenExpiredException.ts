import JWTException from "../JWTException";


export default class AccessTokenExpiredException extends JWTException {
    constructor() {
      super('Access Token Expired')
    }
}