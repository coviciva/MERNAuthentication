const router = require("express").Router();
const Customer = require("../models/customerModel");
const auth = require("../middleware/auth");

//kreiranje novog customera u bazi
//path je /customer/
//auth -> prije nego izvrsi request provjera auth
router.post("/", auth, async (req, res) => {
  try {
    const { name } = req.body;

    const newCustomer = new Customer({ name });
    const savedCustomer = await newCustomer.save();
    res.json(savedCustomer);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});
//dohvacanje customera
router.get("/", auth, async (req, res) => {
  try {
    //find vraca kolekciju customersa kao array
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
