require("dotenv").config();

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
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

const corsOptions = {
    origin: 'http://localhost:3001', 
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { sameSite: "none", secure: true },
    })
);
app.use(cookieParser());

// Routes
app.use("/auth", middleware.auth_request, authRouter);
app.use("/user", middleware.auth_request, userRouter);
app.use("*", defaultRouter);

app.listen(port, () => {
    console.log(`API listening on port ${port}!`);
});
