import express from 'express';
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import Controller from './interfaces/controller'
import { normalizePort } from './utils/helpers'
import errorMiddleware from './middlewares/error.middlewares'

import { server } from './utils/environments'


class App {

  public app: express.Application
  
  constructor(controllers: Controller[]){
    this.app = express()
    this.attatchMiddlewares()
    this.attatchInterceptors()
    this.attatchControllers(controllers)
  }

  public listen() {
    const port: number = normalizePort(server.port)
    this.app.listen(port, () => {
      console.log(`App starts Listening on Port ${port}`)
    })
  }

  private attatchMiddlewares() {
    this.app.use(bodyParser.json)
    this.app.use(cookieParser())
  }

  private attatchInterceptors() {
    this.app.use(errorMiddleware)
  }

  private attatchControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    })
  }

}

export default App