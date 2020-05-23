var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const articleController = require('../controllers/articleController')
const upload = require('../middleware/multer')
// authorization
// router.use(
//     passport.authenticate("jwt", {
//         session: false,
//     })
// );
///////////////
router.post('/article', passport.authenticate("jwt", {
  session: false,
}), upload.middleware('article'), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    articleController.addNewArticle(req, res)
  }
})
router.put('/article', passport.authenticate("jwt", {
  session: false,
}), upload.middleware('article'), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    articleController.editArticle(req, res)
  }
})
router.delete('/article', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    articleController.destroyArticle(req, res)
  }
})

router.get('/articles', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  articleController.getAllArticle(req, res)
})
router.get('/article', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  articleController.singleArticle(req, res)
})


module.exports = router;