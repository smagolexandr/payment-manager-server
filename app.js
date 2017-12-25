var express = require('express'),
  app = express(),
  db = require('./config/db'),
  cors = require('cors'),
  bodyParser = require('body-parser')
  pass = require('./config/pass'),
  passport = require('passport')

//Route
var routes = {}
routes.payment = require('./route/payment.js')
routes.category = require('./route/category.js')
routes.user = require('./route/user.js')

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(passport.initialize())


app.post('/login', routes.user.login)

app.post('/register', routes.user.register)

//Get all categories
app.get('/payment', pass.userIsAuthenticated, routes.payment.list)

app.get('/category/monthly', pass.userIsAuthenticated, routes.payment.monthly)

//Create new Record
app.post('/user/:userId/payment', pass.userIsAuthenticated, routes.payment.create)

//Delete Record
app.delete('/user/:userId/payment/:paymentId', pass.userIsAuthenticated, routes.payment.delete)

//Get all categories
app.get('/category', pass.userIsAuthenticated, routes.category.list)

//Create new category
app.post('/category', pass.userIsAuthenticated, routes.category.create)

//Delete Category
app.delete('/category/:categoryId', pass.userIsAuthenticated, routes.category.delete)

app.listen(8080)