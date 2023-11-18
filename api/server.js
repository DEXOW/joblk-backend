require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
// const Rollbar = require('rollbar');

const app = express();
// const rollbar = new Rollbar({
//   accessToken: '23d9d608d8434be0b28b7452a76368dc',
//   captureUncaught: true,
//   captureUnhandledRejections: true,
// });

const port = process.env.PORT;

require('./controllers/db_connection');
const middleware = require('./middleware');
const defaultRouter = require('./routes/default');
const authRouter = require('./routes/auth');

app.use(cors());
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}));

// Routes
app.use('/auth',middleware.auth_request, authRouter);
app.use('*', defaultRouter);

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});