require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cors = require("cors");
const Rollbar = require("rollbar");

const app = express();

if (process.env.ROLLBAR_TOKEN) {
    const rollbar = new Rollbar({
        accessToken: process.env.ROLLBAR_TOKEN,
        captureUncaught: true,
        captureUnhandledRejections: true,
    });
    app.use(rollbar.errorHandler());
    console.log("Rollbar enabled");
}

const port = process.env.PORT || 3000;

const middleware = require("./middleware");
const nodemailer = require("./controllers/nodemailer");

const defaultRouter = require("./routes/default");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");

app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: true,
    })
);

// Routes
app.use("/auth", middleware.auth_request, authRouter);
app.use("/user", middleware.auth_request, userRouter);
app.use("*", defaultRouter);

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});
