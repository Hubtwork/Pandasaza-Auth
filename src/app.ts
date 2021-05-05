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
import NotFoundException from './app/exceptions/network/NotFoundException';

import mainRouter from './app/routes/routes.index'

import morgan = require('morgan')

export class App {
  
  private logger: Logger = new Logger()
  public app: express.Application
  
  constructor(){
    this.app = express()
  }

  public listen() {
    const port: number = normalizePort(server.port)    
    this.app.listen(port, () => {
      this.logger.info(`App starts Listening on Port ${port}`)
      this.logger.info(`App is running on ${process.env.NODE_ENV}`)
    })
  }

  private attatchMiddlewares() {
    this.app.use(morgan('dev'))
    this.app.use(bodyParser.json)
    this.app.use(cookieParser())
    this.logger.info(`Middlewares Adapted`)
  }

  private attatchInterceptors() {
    this.app.use(function (req, res, next) {
      var err = new Error('Not Found');
      res.status(404).json({
        error: 'Not Found'
      })
      next(err);
    })
    this.app.use(errorMiddleware)
    this.logger.info(`Interceptors Adapted`)
  }

  public attatchControllers(controllers: Controller[]) {
    this.attatchMiddlewares()
    controllers.forEach((controller) => {
      this.app.use('/', controller.router)
    })
    // catch 404 and forward to error handler
    this.app.use((req, res, next) => next(new NotFoundException()))
    this.logger.info(`Controllers Adapted`)
    this.attatchInterceptors()
  }

  public async attatchDBConnection() {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

    await Database.getConnection()
    .then()
    .catch((error) => {
      this.logger.error(error)
    })
  }

}

// export default App

class APP {
  
  private logger = new Logger()
  public app: express.Application

  constructor() {
    this.app = express()
    this.initModules()
    this.initRouters()
    this.initErrorHandlers()
  }

  public serverOn() {
    this.app.listen(server.port, () => {
      this.logger.info(`server running on port : ${server.port}`);
    }).on('error', (e) => this.logger.error(e.message))
  }

  private initModules() {
    this.app.use(morgan('dev'))
    this.app.use(bodyParser.json({ limit: '10mb' }))
    this.app.use(bodyParser.urlencoded({ limit: '10mb', extended: true, parameterLimit: 50000 }))
  }

  private initErrorHandlers() {
    this.app.use((req, res, next) => {
      res.status(404).json({
        error: 'Not Found'
      })
    })
  }

  public initRouters() {
    this.app.use('/', mainRouter)
  }

  public async attatchDBConnection() {
    if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

    await Database.getConnection()
    .catch((error) => {
      this.logger.error(error)
    })
  }

}

export default APP