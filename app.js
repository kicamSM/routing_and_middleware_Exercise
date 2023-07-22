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
// may need an app.use for fakeDB???? 

// items format = [{'name': 'popsicle', 'price': 1.45}, {'name': 'pickle', 'price': 1.00}]

// app.get('/items', (req, res, next) => {

//     res.json(items)
// })

    // const item = items.find(item => item.name === req.params.name)
    // for(item in items) {
    //     res.json({ name: item.name, price: item.price })
    // }
    // res.json({ name: items.name, price: items.price })

app.post('/items', (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if(!req.body.price) throw new ExpressError("Price is required", 400)
        const newItem = { name: req.body.name, price: req.body.price }
        items.push(newItem)
        return res.status(201).json({ added: newItem })
                                                        
      } catch (e) {
        return next(e)
      }
})

app.get("/items/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
    }
    res.json({ name: foundItem.name, price: foundItem })
  })

app.patch("/items/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    // console.log('foundItem', foundItem)
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
    }
    foundItem.name = req.body.name
    foundItem.price = req.body.price
    res.json({ updated: foundItem })
  })

  app.delete("/items/:name", function (req, res) {
    const foundItem = items.findIndex(item => item.name === req.params.name)
    // console.log('foundItem', foundItem)
    if (foundItem === -1) {
      throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    res.json({ message: "Deleted" })
  })




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