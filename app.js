const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const logger = require("./utils/logger");
const notesRouter = require("./Controllers/notes");
const middleware = require("./utils/middleware");
const cors = require("cors");
const userRouter = require("./Controllers/users");
const loginRouter = require("./Controllers/login");

const app = express();

mongoose.set("strictQuery", false);
logger.info("Connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info(`Connected to DB`);
  })
  .catch((error) => {
    logger.error(error);
  });

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/notes", notesRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
