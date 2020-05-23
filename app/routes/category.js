var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const categoryController = require('../controllers/categoryController')






// with authenticate
// router.use(
//   passport.authenticate("jwt", {
//     session: false,
//   })
// );

router.post('/category', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    categoryController.insertCategory(req, res)
  }
})
router.put('/category', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    categoryController.editCategory(req, res)
  }
})
router.delete('/category', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    categoryController.destroyCategory(req, res)
  }
})

module.exports = router;