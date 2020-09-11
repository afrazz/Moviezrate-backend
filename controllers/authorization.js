const redisClient = require('./databaseController/databaseController').redisClient;

// For Security
// It's a middleware for checking the header has Valid JWT authorization. If there is it will go to the next step (i.e go to getting the profile info)
const requireAuth = (req, res, next) => {
    const { authorization } = req.headers;
    if(!authorization) {
        return res.status(401).json('Unauthorized')
    }
     redisClient.get(authorization, (err, reply) => {
        if(err || !reply) {
            console.log(err)
            return res.status(401).json('Unauthorized')
        }
        return next()
    })  
}

module.exports = {
    requireAuth
}