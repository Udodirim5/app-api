const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("shutting down the server due to uncaught exception");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("DB Connection Established!");
  });
console.log(process.env.NODE_ENV);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  // console.log(err.name, err.message);
  console.log("shutting down the server");
  server.close(() => {
    process.exit(1);
  });
});
