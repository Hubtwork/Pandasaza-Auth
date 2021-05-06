import { Response } from "express";
import { AuthFailureResponse, AccessTokenErrorResponse, InternalErrorResponse, NotFoundResponse, BadRequestResponse, ForbiddenResponse } from "./response.API";

enum ErrorType {
  BAD_TOKEN = 'BadTokenError',
  TOKEN_EXPIRED = 'TokenExpiredError',
  UNAUTHORIZED = 'AuthFailureError',
  ACCESS_TOKEN = 'AccessTokenError',
  INTERNAL = 'InternalError',
  NOT_FOUND = 'NotFoundError',
  NO_ENTRY = 'NoEntryError',
  NO_DATA = 'NoDataError',
  BAD_REQUEST = 'BadRequestError',
  FORBIDDEN = 'ForbiddenError',
}

export abstract class ApiError extends Error {
  constructor(public type: ErrorType, public message: string = 'error') {
    super(type)
  }

  public static handle(error: ApiError, response: Response) {
    switch(error.type) {
      case ErrorType.BAD_TOKEN:
      case ErrorType.TOKEN_EXPIRED:
      case ErrorType.UNAUTHORIZED:
        return new AuthFailureResponse(error.message).send(response)
      case ErrorType.ACCESS_TOKEN:
        return new AccessTokenErrorResponse(error.message).send(response)
      case ErrorType.INTERNAL:
        return new InternalErrorResponse(error.message).send(response)
      case ErrorType.NOT_FOUND:
      case ErrorType.NO_ENTRY:
      case ErrorType.NO_DATA:
        return new NotFoundResponse(error.message).send(response)
      case ErrorType.BAD_REQUEST:
        return new BadRequestResponse(error.message).send(response)
      case ErrorType.FORBIDDEN:
        return new ForbiddenResponse(error.message).send(response)
      default: {
        let message = error.message;
        // Do not send failure message in production as it may send sensitive data
        if (process.env.NODE_ENV === 'production') message = 'Something wrong happened.'
        return new InternalErrorResponse(message).send(response)
      }
    }
  }
}

export class AuthFailureError extends ApiError {
  constructor(message = 'Invalid Credentials') {
    super(ErrorType.UNAUTHORIZED, message);
  }
}

export class InternalError extends ApiError {
  constructor(message = 'Internal error') {
    super(ErrorType.INTERNAL, message);
  }
}

export class BadRequestError extends ApiError {
  constructor(message = 'Bad Request') {
    super(ErrorType.BAD_REQUEST, message);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'Not Found') {
    super(ErrorType.NOT_FOUND, message);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Permission denied') {
    super(ErrorType.FORBIDDEN, message);
  }
}

export class NoEntryError extends ApiError {
  constructor(message = "Entry don't exists") {
    super(ErrorType.NO_ENTRY, message);
  }
}

export class BadTokenError extends ApiError {
  constructor(message = 'Token is not valid') {
    super(ErrorType.BAD_TOKEN, message);
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message = 'Token is expired') {
    super(ErrorType.TOKEN_EXPIRED, message);
  }
}

export class NoDataError extends ApiError {
  constructor(message = 'No data available') {
    super(ErrorType.NO_DATA, message);
  }
}

export class AccessTokenError extends ApiError {
  constructor(message = 'Invalid access token') {
    super(ErrorType.ACCESS_TOKEN, message);
  }
}