const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const nftRouter = require("./routes/nftsRoutes");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json({ limit: "10kb" })); //TODO: ADJUST FILE SIZE TO PREFERENCE DEPENDING ON THE TYPE OF THE APPLICATION

// DATA SANITIZATION against NoSQL query injection
app.use(mongoSanitize());

// DATA SANITIZATION against site script XSS
app.use(xss());

//  SECURE HEADER HTTP
app.use(helmet());

// RATE LIMIT
const limiter = rateLimit({
  max: 100, // TODO: MAKE SURE TO INCREASE THIS VALUE ALONG THE WAY
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }

app.use(morgan("dev"));

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// CUSTOM MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/api/v1/nfts", nftRouter);
app.use("/api/v1/users", usersRouter);

// ERROR HANDLING SECTION
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
