var config = require("../../config/config");
var express = require("express");
var router = express.Router();
const passport = require('passport');
const User = require("../models/user");
const categoryController = require('../controllers/categoryController')
const productController = require('../controllers/productController')
const commentController = require('../controllers/commentController')
const articleController = require('../controllers/articleController')


router.get('/categories', (req, res) => {
  categoryController.allCategories(req, res)
})
router.get('/category', (req, res) => {
  categoryController.singleCategories(req, res)
})
router.get('/products', (req, res) => {
  productController.allProducts(req, res)
})
router.get('/product', (req, res) => {
  productController.singleProducts(req, res)
})

router.get('/comments', commentController.getAllComment);

router.get('/articles', (req, res) => {
  articleController.getAllArticle(req, res)
})
router.get('/article', (req, res) => {
  articleController.singleArticle(req, res)
})

module.exports = router