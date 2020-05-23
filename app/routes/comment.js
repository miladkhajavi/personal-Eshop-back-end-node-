var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const commentController = require('../controllers/commentController')
// authorization
// router.use(
//     passport.authenticate("jwt", {
//         session: false,
//     })
// );
///////////////
router.post('/comment', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  commentController.addComment(req, res)
})
router.get('/comment', passport.authenticate("jwt", {
  session: false,
}), (req, res) => {
  if (req.user.role !== 'superAdmin' && req.user.role !== 'admin') {
    return res.status(403).send({
      error: `access denied`
    })
  } else {
    commentController.getAllRequestComments(req, res)
  }
})

router.delete('/comment', passport.authenticate("jwt", {
  session: false,
}), commentController.destroy);


module.exports = router;