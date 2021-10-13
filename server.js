const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./app/db')
const {body, validationResult} = require('express-validator')

// region SETUP

const app = express()
const corsOptions = {
  origin: 'http://localhost:8081',
}
const now = () => new Date(Date.now()).toLocaleString()

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }))

app.use(function(req, res, next) {
  console.log(`\n--------${now()}---------`)
  console.trace(`${req.method} ${req.url}`)
  if(req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.trace('Body', req.body)
  }
  next()
})

//endregion

//region ENDPOINTS

app.get('/api/wishes', async function(req, res) {
  const wishes = await db.wishes.getAll()
  res.json(wishes)
})

app.get('/api/wishes/:wishId([0-9]+)', function(req, res) {
  db.wishes.getById(Number(req.params.wishId))
    .then(wish => {
      console.trace(wish)
      res.json(wish)
    })
    .catch(error => {
      console.log(error)
      res.status(404).json(error.message)
    })
})

app.post('/api/wishes',
  body('title')
    .isString()
    .isLength({min: 1, max: 128}),
  body('description')
    .isString()
    .isLength({min: 1, max: 1024}),
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    db.wishes.create(req.body)
      .then(wishId => res.json(wishId))
      .catch(error => {
        console.trace(error)
        res.status(500).json(error)
      })
  })

app.get('/api/wishes/:wishId([0-9]+)/offers', function(req, res) {
  console.trace('Request params', req.params)
  res.status(200).json('ok')
})

app.get('/api/offers/:offerId([0-9]+)', function(req, res) {
  console.trace('Request params', req.params)
  res.status(200).json('ok')
})

app.post('/api/offers', function(req, res) {
  console.trace('Request params', req.params)
  console.trace(req.body)
  res.status(200).json('ok')
})

app.delete('/api/wishes/:wishId', function(req, res) {
  console.trace('Request params', req.params)
  res.status(200).json('ok')
})

app.delete('/api/offers/:offerId', function(req, res) {
  console.trace('Request params', req.params)
  res.status(200).json('ok')
})

//endregion

app.all('*', function(req, res) {
  console.trace('404')
  console.trace(`${req.method} ${req.url}`)
  res.status(404).json({error: `Unknown route: ${req.method} ${req.url}`})
})

const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
