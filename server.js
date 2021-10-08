const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const model = require('./app/model')
const {body, validationResult} = require('express-validator')

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

//region ENDPOINTS

app.get('/api/wishes', function(req, res) {
  res.json(model.wishes.getAll())
})

app.post('/api/wishes',
  body('title')
    .isString()
    .isLength({max: 128}),
  function(req, res) {
    if (!validationResult(req).isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    model.wishes.create(req.body)
      .then(wishId => res.json(wishId))
      .catch(error => {
        console.trace(error)
        res.status(500).json(error)
      })
  })

app.put('/api/wishes/:wishId([0-9]+)', function(req, res) {
  // validate.wish(req.body, res)
  console.trace('Request params', req.params)
  console.trace('Request body', req.body)
  res.status(200).json('ok')
  /*db.wishes.update(req.params.wishId, req.body)
    .then(() => res.status(200))
    .catch(error => {
      console.trace(error)
      res.status(500).json(error)
    })*/
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
