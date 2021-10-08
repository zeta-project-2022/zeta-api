const wishes = []

function timeout(ms) {
  if(ms === 'undefined') {
    ms = 500
  }
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  wishes: {
    getById: async function(id) {

    },
    getAll: async function(from, to) {
      timeout()
      return wishes
    },
    add: async function(wish) {
      wishes.push(wish)
      timeout()
      return wishes.length - 1
    },
    update: async function(wish) {

    },
    delete: async function(id) {

    },
  },
}
