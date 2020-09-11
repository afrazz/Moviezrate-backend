const jwt = require('jsonwebtoken');
const redisClient = require('./databaseController/databaseController').redisClient;

// Handling register
const handleRegister = (req, res, db, bcrypt) => {
  const { name, password } = req.body;
  if ( !name || !password) {
    return Promise.reject('incorrect form submission');
  } else if (name.length <= 3) {
    return Promise.reject('Username 4 char required');
  } else if (password.length <= 3) {
    return Promise.reject('Password 4 char required');
  }
  const hash = bcrypt.hashSync(password);
    return db.transaction(trx => {
      trx.insert({
        hash: hash,
        name: name
      })
      .into('login')
      .returning('name')
      .then(loginName => {
        return trx('users')
          .returning('*')
          .insert({
            name: loginName[0],
            joined: new Date()
          })
          .then(user => {
            return user[0];
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
    })
    .catch(err => Promise.reject('unable to register'));
}

// Signing the JWT Token with username
signToken = (name) => {
  const jwtPayload = { name }
  return jwt.sign(jwtPayload, 'JWT_SECRET', {expiresIn: '2 days'})
}

// Storing Jwt token into the Redis DB.
const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
}

// For managing Session JWT managment 
const setAuthId = (user) => {
  const { id, name } = user
  const token = signToken(name)
    return setToken(token, id)
      .then(data => {
      return {status: 'success', userId: id, token: token}
    })
    .catch(err => 'Unauthorized');
  
}

// This is the main function for setting the user Auth
const registerAuthentication = (req, res, db, bcrypt) => {
  handleRegister(req, res, db, bcrypt)
  .then(user => user.id && user.name ? setAuthId(user) : Promise.reject('unable to register'))
  .then(session => res.json(session))
  .catch(err => res.status(400).json(err));
}


module.exports = {
  registerAuthentication: registerAuthentication
};


