import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import errorHandler from './errorHandler.js'
import routes from './routes.js'

const app = express()

// MB-TODO: What are middlewares in Express?
/** Middlewares in Express (and in general) is used to handle every request and response before and after it
 * is handled in the routes and in the bread code
 * This can be used for example in counting the amount of queries to the database or the response time of the server
 * */
// MB-TODO: What these middlewares do?
// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
app.use(express.json())
// Returns middleware that only parses urlencoded bodies and only looks at requests where the Content-Type header matches the type option
app.use(express.urlencoded({ extended: true }))
// Helmet is a security related middleware which is responsible to protect against common web vulnerabilities such as xss, or csrf
app.use(helmet())
// Morgan is a logging middleware, which can be configured. In this case, Morgan uses the built-in method "tiny"
app.use(morgan('tiny'))

app.use(routes)

// This is a simple errorhandler which is called when there is an error from any of the routes
app.use(errorHandler)

export default app
