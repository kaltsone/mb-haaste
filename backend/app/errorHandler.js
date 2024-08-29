import config from './config.js'

export class NotImplemented extends Error {
  constructor(message) {
    super(message || 'Not Implemented');
    this.name = "NotImplemented";
    this.status = 501
  }
}
export class NotFound extends Error {
  constructor(message) {
    super(message || 'Not Found');
    this.name = "NotFound";
    this.status = 404
  }
}
export class NotAllowed extends Error {
  constructor(message) {
    super(message || 'Not Allowed');
    this.name = "NotAllowed";
    this.status = 403
  }
}


const errorHandler = (err, req, res, _next) => {
  res.status(err.status || 500)
  req.error = err
  if (config.nodeEnv !== 'production' && res.statusCode >= 500) {
    console.error(err)
  }
  return res.send({ ...err.data, message: err.message })
}

export default errorHandler