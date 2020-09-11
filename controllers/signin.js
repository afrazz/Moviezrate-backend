const jwt = require('jsonwebtoken');
const redisClient = require('./databaseController/databaseController').redisClient;

// HandleSign If they didn't have a Jwt token
const handleSignin = (db, bcrypt, req, res) => {
  const { name, password } = req.body;
  if (!name || !password) {
    return Promise.reject('incorrect form submission')
  }
  return db.select('name', 'hash').from('login')
    .where('name', '=', name)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('name', '=', name)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'))
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch(err => Promise.reject('wrong credentials'))
}

// If there is a JWT Token in authorization header check those with redis db and return the users id 
const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({id: reply})
  }) 
}

// Signing the JWT Token with username
const signToken = (name) => {
  const jwtPayload = { name }
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'})
}

// Storing Jwt token into the Redis DB.
const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value))
}

// Returning User data from handleSignin fn for creating session managment
const createSessions = (user) => {
  const { name, id } = user;
  const token = signToken(name);
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true', userId: id, token: token
      }
    })
    .catch(console.log)
}

// This is the main function for check the user has Auth or not
const signinAuthentication = (db , bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? getAuthTokenId(req, res) : 
    handleSignin(db, bcrypt, req, res).then(data => {
      return data.id && data.name ? createSessions(data) : Promise.reject(data)
    })
    .then(session => res.json(session))
    .catch(err => res.status(400).json(err))
}

module.exports = {
  signinAuthentication,
  redisClient
}