
var express = require('express'),
  app = express(),
  db = require('./config/db'),
  pass = require('./config/pass'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session')

//Route
var routes = {}
routes.payment = require('./route/payment.js')
routes.category = require('./route/category.js')
routes.user = require('./route/user.js')

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
// app.use(express.methodOverride());
app.use(cookieSession({ secret: 'itisrealsecret' }))
app.use(passport.initialize())
app.use(passport.session())


app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost')
  res.set('Access-Control-Allow-Credentials', true)
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT')
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
  if ('OPTIONS' == req.method) return res.send(200)
  next()
})

app.post('/login', routes.user.login)

app.post('/register', routes.user.register)

app.get('/logout', pass.userIsAuthenticated, routes.user.logout)

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

app.listen(3000)