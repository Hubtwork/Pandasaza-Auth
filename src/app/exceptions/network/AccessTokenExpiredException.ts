import HttpException from "../HttpException";


export default class AccessTokenExpiredException extends HttpException {
    constructor() {
      super(401, 'Access Token Expired')
    }
}