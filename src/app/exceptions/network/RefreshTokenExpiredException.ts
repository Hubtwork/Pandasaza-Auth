import HttpException from "../HttpException";


export default class RefreshTokenExpiredException extends HttpException {
    constructor() {
      super(401, 'Refresh Token Expired')
    }
}