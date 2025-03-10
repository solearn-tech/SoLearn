abstract class CustomError extends Error {
  abstract statusCode: number;
  
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}

export class BadRequestError extends CustomError {
  statusCode = 400;
  
  constructor(public message: string, public validationErrors?: any[]) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    if (this.validationErrors) {
      return this.validationErrors.map(error => ({
        message: error.message,
        field: error.field,
      }));
    }
    
    return [{ message: this.message }];
  }
}

export class NotFoundError extends CustomError {
  statusCode = 404;
  
  constructor(public message: string = 'Not Found') {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  
  constructor(public message: string = 'Not authorized') {
    super(message);
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class ForbiddenError extends CustomError {
  statusCode = 403;
  
  constructor(public message: string = 'Forbidden') {
    super(message);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class DatabaseError extends CustomError {
  statusCode = 500;
  
  constructor(public message: string = 'Database Error') {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}

export class InternalServerError extends CustomError {
  statusCode = 500;
  
  constructor(public message: string = 'Internal Server Error') {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
} 