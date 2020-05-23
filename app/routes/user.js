var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const logger = require("../middleware/logger");
const UserController = require('../controllers/userController')


router.get("/profile", passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  UserController.showProfile(req, res)
});

router.put("/profile", passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  UserController.editProfile(req, res)
})

router.get("/cart", passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  UserController.addToCart(req, res)
})
router.get("/items", passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  UserController.getItemsCart(req, res)
})

router.get("/deleteitem", passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  UserController.destroyedItemsCart(req, res)
})
module.exports = router;