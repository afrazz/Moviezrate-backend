const redisClient = require('./databaseController/databaseController').redisClient;

// For getting user information by id
const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

// For updating the user profile
const handleProfileUpdate = (req, res, db) => {
  const { id } = req.params;
  const { favouritemovie, favouriteactor } = req.body;
  db('users')
    .where({ id })
    .update({ favouritemovie, favouriteactor })
    .then(resp => {
      if (resp) {
        res.json("success")
      } else {
        res.status(400).json('Unable to update')
      }
    })
    .catch(err => res.status(400).json(err))
}

// When user signedout
const handleProfileSignout = (req, res) => {
  const { authorization } = req.headers;
  redisClient.del(authorization, function(err, reply) {
    if (err || !reply) {
       res.json("Unable to signout")
    }
    return res.json({signOut: 'success'});
 })
}

// For checking the profile has JWT Token
const handleProfileAuth = (req, res) => {
  const { authorization } = req.headers;
  redisClient.get(authorization, function(err, reply) {
    if (err || !reply) {
       return res.json('unauthorized')
    }
    return res.json('auth ok');
 })
}


module.exports = {
  handleProfileGet,
  handleProfileUpdate,
  handleProfileSignout,
  handleProfileAuth
}

