module.exports = {
  wish: function (wish, res) {
    if(typeof wish.title !== 'string') {
      console.trace(wish)
      res.status(400).json({error: 'Missing Wish parameter: title'})
    }
  },
}
