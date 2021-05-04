

class JWTException extends Error {
    public message: string
    constructor(message: string) {
      super(message)
      this.message = `[ JWT ] ${message}`
    }
}

export default JWTException