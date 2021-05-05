


import HttpException from "../HttpException";


export default class InternalServerException extends HttpException {
    constructor() {
      super(400, 'Forbidden')
    }
}