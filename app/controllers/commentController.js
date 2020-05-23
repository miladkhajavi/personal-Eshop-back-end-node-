const controller = require('../controllers/controller')
const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Category = require("../models/category");
const Product = require("../models/product");
const fs = require('fs');
const path = require('path');
class commentController extends controller {

    async addComment(req, res) {
        try {
            let item = await new Comment({
                user: req.user._id,
                product: req.body.product,
                article: req.body.article,
                comment: req.body.comment,
                parent: req.body.parent
            })
            item.check = false
            item.save()
            if (item.product) {
                await Product.findOneAndUpdate({
                    _id: req.body.product
                }, {
                    $inc: {
                        commentCount: 1
                    }
                })
            }
            if (item.article) {
                await Article.findOneAndUpdate({
                    _id: req.body.article
                }, {
                    $inc: {
                        commentCount: 1
                    }
                })
            }
            res.json({
                success: true,
                msg: 'نظر شما با موفقیت ثبت شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async destroy(req, res, next) {
        try {
            const comment = await Comment.findOne({
                _id: req.query.id,
                user: req.user._id
            }).populate([{
                path: 'comments'
            }, {
                path: 'product',
                model: Product,
                select: 'commentCount title viewCount body price'
            }, {
                path: 'article',
                model: Article
            }]).exec();
            if (!comment) {
                return res.json({
                    success: false,
                    msg: 'چنین دیدگاهی در سیستم ثبت نشده است'
                })
            }
            let countChild = comment.comments.length
            let count = countChild + 1
            comment.comments.forEach(comment => comment.remove());
            if (comment.product) {
                await comment.product.inc('commentCount', -count);
            }
            if (comment.article) {
                await comment.article.inc('commentCount', -count);
            }
            comment.remove();
            res.json({
                success: true,
                msg: 'نظر حذف شد'
            })

        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async getAllRequestComments(req, res) {
        try {
            let limit = 20
            let page = req.query.page || 1 || "1"
            let count = await Comment.countDocuments({
                check: false
            })
            let divide = count / limit
            let countPage = Math.ceil(divide)
            let items = await Comment.find({
                check: false
            }).populate([{
                path: 'product',
                model: Product,
                select: 'title body'
            }, {
                path: 'user',
                model: User,
                select: 'userName'
            }, {
                path: 'article',
                model: Article
            }]).skip((limit * page) - limit).limit(limit).sort({
                createdAt: -1
            }).exec()
            if (!items || items.length === 0) {
                return this.back(req, res)
            }
            res.json({
                success: true,
                items,
                count,
                countPage,
                limit,
                page
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async getAllComment(req, res) {
        try {
            const item = await Comment.paginate({
                parent: null,
                check: true
            }, {
                limit: 25,
                sort: {
                    createdAt: -1
                },
                populate: [{
                    path: 'product',
                    model: Product,
                    select: 'title body'
                }, {
                    path: 'user',
                    model: User,
                    select: 'userName'
                }, {
                    path: 'article',
                    model: Article
                }, {
                    path: 'comments',
                    select: 'user comment check',
                    populate: {
                        path: 'user',
                        model: User,
                        select: 'userName'
                    }
                }]
            })
            if (!item.docs || item.docs.length === 0) {
                return this.back(req, res)
            }

            res.json({
                success: true,
                item,
                msg: 'درخواست موفق'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

}

module.exports = new commentController()