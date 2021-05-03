import express from 'express';
import * as bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import Controller from './interfaces/controller'
import { normalizePort } from './utils/helpers'

import { server } from './utils/environments'
import { Logger } from './utils/logger';
import { Database } from './config/database';
import errorMiddleware from './app/middlewares/error.middlewares';
import { profile } from 'winston';

class App {
  
  private logger: Logger = new Logger()
  public app: express.Application
  
  constructor(controllers: Controller[]){
    this.app = express()
    this.attatchMiddlewares()
    this.attatchInterceptors()
    this.attatchDBConnection()
    this.attatchControllers(controllers)
  }

  public listen() {
    const port: number = normalizePort(server.port)
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'
    Database.getConnection().then(() => {
      this.app.listen(port, () => {
        this.logger.info(`App starts Listening on Port ${port}`)
        this.logger.info(`App is running on ${process.env.NODE_ENV}`)
      })
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

  private async attatchDBConnection() {

  }

}

export default App