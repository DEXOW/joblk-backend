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

const printLogs = require("./utils/status_logs");

const defaultRouter = require("./routes/default");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const portfolioRouter = require("./routes/portfolio");
const jobRouter = require("./routes/job")
const reviewRouter = require("./routes/review")

const corsOptions = {
    origin: 'https://joblk-frontend.vercel.app', 
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", middleware.auth_request, authRouter);
app.use("/user", middleware.auth_request, userRouter);
app.use("/portfolio", middleware.auth_request, portfolioRouter);
app.use("/job", middleware.auth_request, jobRouter);
app.use("/review", middleware.auth_request, reviewRouter);
app.use("*", defaultRouter);

app.listen(port, () => {
    printLogs.startUpLogs();
});
