var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const productController = require('../controllers/productController')
const upload = require('../middleware/multer')
const courseValidator = require('../validator/productValidator');

// router.use(
//     passport.authenticate("jwt", {
//         session: false,
//     })
// );

router.post('/product', passport.authenticate("jwt", {
  session: false,
}), upload.middleware('product'), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    productController.insertProduct(req, res)
  }
})

router.put('/product', passport.authenticate("jwt", {
  session: false,
}), upload.middleware('product'), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    productController.editProduct(req, res)
  }
})
router.delete('/product', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    productController.destroyProduct(req, res)
  }
})




module.exports = router;