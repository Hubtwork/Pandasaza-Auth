import JWTException from "../JWTException";



export default class InvalidSignatureException extends JWTException {
    constructor() {
      super('Tried to Verify with Invalid Signature')
    }
}