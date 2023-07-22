const express = require('express');
// const items = require('./itemsRoutes')
// const app = require('./app')
const router = new express.Router();
const ExpressError = require("./expressError")
const items = require('./fakeDB')

router.get('/', (req, res) => {
    console.log(items)
    res.json(items)
})

router.post('/', (req, res, next) => {
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

router.get("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
    }
    res.json(foundItem)
  })

router.patch("/:name", function (req, res) {
    const foundItem = items.find(item => item.name === req.params.name)
    console.log(foundItem)
    if (foundItem === undefined) {
      throw new ExpressError("Item not found", 404)
    }
    foundItem.name = req.body.name || foundItem.name
    foundItem.price = req.body.price || foundItem.price
    res.json({ updated: foundItem })
  })


router.delete("/:name", function (req, res) {
    const foundItem = items.findIndex(item => item.name === req.params.name)
    if (foundItem === -1) {
      throw new ExpressError("Item not found", 404)
    }
    items.splice(foundItem, 1)
    res.json({ message: "Deleted" })
  })




module.exports = router; 
