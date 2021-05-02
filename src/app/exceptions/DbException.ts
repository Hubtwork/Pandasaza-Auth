
class DbException extends Error {
    public message: string
    constructor(message: string) {
      super(message)
      this.message = message
    }
}

export default DbException