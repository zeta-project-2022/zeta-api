var express = require('express');
var secured = require('../secured');
var router = express.Router();
const {body, validationResult} = require('express-validator')
const db = require('../db')

router.get('/api2/wishes', secured(), async function (req, res, next) {
  console.trace(req.user)
  const wishes = await db.wishes.getAll()
  res.json(wishes)
});

router.post('/api2/wishes',
  secured(),
  [
    body('title')
      .isString()
      .isLength({min: 1, max: 128}),
    body('description')
      .isString()
      .isLength({min: 1, max: 1024}),
  ],
  function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    // Current dev position: if user.id is present, pass it to DB!
    console.trace(req.user)

    // userId is hard coded for now
    db.wishes.create(req.body, 'test_user')
      .then(wishId => res.json(wishId))
      .catch(error => {
        console.trace(error)
        res.status(500).json(error)
      })
  })


module.exports = router;
