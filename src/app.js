require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');

const Youch = require('youch')
const Sentry = require('@sentry/node')

const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

const cors = require('cors');
const routes = require('./routes')

mongoose.connect('mongodb+srv://admin:admin@nextfood-cnfht.mongodb.net/nextfood?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class App {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== 'production'

    this.cors();
    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }
  
  cors() {
    this.express.use(cors())
  }
  
  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    mongoose.connect(
      databaseConfig.uri,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
  }
  middlewares() {
    this.express.use(express.json());
    this.express.use(Sentry.Handlers.requestHandler());
  }

  routes() {
    this.express.use(routes)
  }

  exception () {
    if (process.env.NODE_ENV === 'production') {
      this.express.use(Sentry.Handlers.errorHandler())
    }

    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({ error: 'Internal Server Error' })
    })
  }
}

module.exports = new App().express;