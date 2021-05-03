
class DbException extends Error {
    public message: string
    constructor(message: string) {
      super(message)
      this.message = `[ DB ] ${message}`
    }
}

export default DbException