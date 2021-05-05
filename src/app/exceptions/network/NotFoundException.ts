import HttpException from "../HttpException";


export default class NotFoundException extends HttpException {
    constructor() {
      super(404, 'Not Found')
    }
}