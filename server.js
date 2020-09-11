const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs'); 
const cors = require('cors');
const helmet = require('helmet');
var morgan = require('morgan');
const pgdatabase = require('./controllers/databaseController/databaseController').db;

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const auth = require('./controllers/authorization');

// Postgres
const db = pgdatabase;

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

// Root
app.get('/', (req, res)=> { res.send("It's working") })
// Signin route
app.post('/signin', signin.signinAuthentication(db, bcrypt))
// Register route
app.post('/register',  (req, res) => { register.registerAuthentication(req, res, db, bcrypt) })
// ProfileGetting route
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})
// For updating user profile
app.post('/profile/:id', auth.requireAuth, (req, res) => {profile.handleProfileUpdate(req, res, db)})
// For checking profileAuth
app.get('/profileauth', (req, res) => { profile.handleProfileAuth(req, res, db)})
// Signout route
app.delete('/signout', auth.requireAuth, (req, res) => { profile.handleProfileSignout(req, res, db)})


app.listen(3001, ()=> {
  console.log('app is running on port 3001');
})
