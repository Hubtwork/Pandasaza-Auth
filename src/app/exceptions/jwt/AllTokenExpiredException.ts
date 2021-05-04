import JWTException from "../JWTException";


export default class AllTokenExpiredException extends JWTException {
    constructor() {
      super('All Token Expired')
    }
}