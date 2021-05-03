import HttpException from "../HttpException";


export default class NoValidAccountException extends HttpException {
    constructor() {
      super(401, 'No Valid Account Exception')
    }
}