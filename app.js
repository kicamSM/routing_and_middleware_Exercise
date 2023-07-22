const express = require('express');
const ExpressError = require('./expressError');
// const middleware = require("./middleware")
const fakeDb = require('./fakeDB');
const morgan = require('morgan');
const itemsRoutes = require('./itemsRoutes');

const app = express();

app.use(express.json());
// app.use(express.urlencoded({ extended: true}));
app.use(morgan("dev"));
app.use("/items", itemsRoutes);
// this is how it knows to go to this file for items





// *********************************
app.use((req, res, next) => {
    const e = new ExpressError('PAGE NOT FOUND', 404)
    next(e)
})

app.use((error, req, res, next) => {
    res.status(error.status).send(error.msg)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
  
    return res.json({
      error: err.message,
    });
  });

module.exports = app;