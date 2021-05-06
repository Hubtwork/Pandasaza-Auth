

class JWTException extends Error {
    public message: string
    constructor(name: string, message: string) {
      super(message)
      this.name = name
      this.message = `[ JWT ] ${message}`
    }
}

export default JWTException