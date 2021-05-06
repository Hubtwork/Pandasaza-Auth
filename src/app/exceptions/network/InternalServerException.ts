import HttpException from "../HttpException";


export default class InternalServerException extends HttpException {
    constructor() {
      super(500, 'Internal Server Error')
    }
}