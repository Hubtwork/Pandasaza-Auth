import HttpException from "../HttpException";


export default class InternerServerException extends HttpException {
    constructor() {
      super(500, 'Internal Server Error')
    }
}