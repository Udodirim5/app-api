const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const nftRouter = require("./routes/nftsRoutes");
const usersRouter = require("./routes/usersRoute");

const app = express();
app.use(express.json());

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
