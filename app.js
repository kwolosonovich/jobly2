/** Express app for jobly. */

const express = require("express");
const cors = require("cors");
const ExpressError = require("./helpers/expressError");

const companiesRouter = require("./routes/companies");
const jobsRouter = require("./routes/jobs");
const usersRouter = require("./routes/users")
const authRouter = require("./routes/auth");

const morgan = require("morgan");

const app = express();

app.use(express.json());

// allow connections to all routes from any browser
app.use(cors());

// HTTP request logger middleware
app.use(morgan("dev"));

// routes
app.use("/companies", companiesRouter);
app.use("/jobs", jobsRouter);
app.use("/users", usersRouter)
app.use("/auth", authRouter)

/** 404 handler */
app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.stack);

  return res.json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;