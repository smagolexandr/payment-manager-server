var express = require('express'),
  app = express(),
  db = require('./config/db'),
  pass = require('./config/pass'),
  passport = require('passport'),
  cookieParser = require('cookie-parser'),
  cookieSession = require('cookie-session')

//Route
var routes = {}
routes.records = require('./route/records.js')
routes.categories = require('./route/categories.js')
routes.users = require('./route/users.js')

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

app.post('/login', routes.users.login)

app.post('/register', routes.users.register)

app.get('/logout', pass.userIsAuthenticated, routes.users.logout)

//Create new Record
app.post('/users/:userId/records', pass.userIsAuthenticated, routes.records.create)

//Delete Record
app.delete('/users/:userId/records/:recordId', pass.userIsAuthenticated, routes.records.delete)

//Get all categories
app.get('/categories', pass.userIsAuthenticated, routes.categories.list)

//Create new category
app.post('/categories', pass.userIsAuthenticated, routes.categories.create)

//Delete Category
app.delete('/categories/:categoryId', pass.userIsAuthenticated, routes.categories.delete)

app.listen(3000)