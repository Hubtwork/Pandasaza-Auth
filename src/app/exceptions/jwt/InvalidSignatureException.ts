import JWTException from "../JWTException";



export default class InvalidSignatureException extends JWTException {
    constructor() {
      super('InvalidSign', 'Tried to Verify with Invalid Signature')
    }
}