
class DbException extends Error {
    public message: string
    constructor(name: string, message: string) {
      super(message)
      this.name = name
      this.message = `[ DB ] ${message}`
    }
}

export default DbException