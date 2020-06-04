const express = require('express')
const mongoose = require('mongoose');
const cors = require('cors');
const routes = require('./routes')

mongoose.connect('mongodb+srv://admin:admin@nextfood-cnfht.mongodb.net/nextfood?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

class App {
  constructor() {
    this.express = express();
    
    this.cors();
    this.middlewares();
    this.routes();
  }
  
  cors() {
    this.express.use(cors())
  }

  middlewares() {
    this.express.use(express.json());
  }

  routes() {
    this.express.use(routes)
  }
}

module.exports = new App().express;