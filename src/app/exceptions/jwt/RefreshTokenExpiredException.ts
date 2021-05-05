import JWTException from "../JWTException";



export default class RefreshTokenExpiredException extends JWTException {
    constructor() {
      super('RefreshTokenExpired', 'Refresh Token Expired')
    }
}