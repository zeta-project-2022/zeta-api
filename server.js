const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
var session = require('express-session');
const db = require('./app/db')
const authRouter = require('./app/routes/auth')
const usersRouter = require('./app/routes/users')
const wishesRouter = require('./app/routes/wishes')
const {body, validationResult} = require('express-validator')

var strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/callback',
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);

// You can use this section to keep a smaller payload
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

// region SETUP

const app = express()
const corsOptions = {
  origin: 'http://localhost:8081',
}
const now = () => new Date(Date.now()).toLocaleString()

// config express-session
const sess = {
  secret: 'CHANGE THIS SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};

if (app.get('env') === 'production') {
  // If you are using a hosting provider which uses a proxy (eg. Heroku),
  // comment in the following app.set configuration command
  //
  // Trust first proxy, to prevent "Unable to verify authorization request state."
  // errors with passport-auth0.
  // Ref: https://github.com/auth0/passport-auth0/issues/70#issuecomment-480771614
  // Ref: https://www.npmjs.com/package/express-session#cookiesecure
  // app.set('trust proxy', 1);

  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', authRouter);
app.use('/', usersRouter);
app.use('/', wishesRouter);

// Log every incoming request
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

app.get('/', function(req, res) {
  res.json('hello from Zeta API')
})

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

    // userId is hard coded for now
    db.wishes.create(req.body, 'user1@mail.com')
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
