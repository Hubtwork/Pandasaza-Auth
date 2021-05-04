import JWTException from "../JWTException";



export default class RefreshTokenExpiredException extends JWTException {
    constructor() {
      super('Refresh Token Expired')
    }
}