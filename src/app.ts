import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser'

import { ValidationError} from 'class-validator'
import { ApiError, BadRequestError, InternalError } from './core/responses/response.Error'
import { server } from './utils/environments'
import { Logger } from './utils/logger';
import { Database } from './config/database'

import mainRouter from './app/routes/routes.index'

import morgan = require('morgan')

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

    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof ApiError) {
        ApiError.handle(err, res);
      } else if (err instanceof Array) {
        // it means validation errors
        const message = err.map( (validationError: ValidationError) => validationError.constraints)
        console.log(message)
        return ApiError.handle(new BadRequestError('Invalid Parameters'), res)
      }
      else {
        if (process.env.NODE_ENV === 'development') {
          this.logger.error(err.message)
          return res.status(500).send(err.message);
        }
        ApiError.handle(new InternalError(), res);
      }
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