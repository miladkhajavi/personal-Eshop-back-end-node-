const controller = require('../controllers/controller')
const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Category = require("../models/category");
const Product = require("../models/product");
const Moment = require("../middleware/date");
const fs = require('fs');
const path = require('path');
class articleController extends controller {

    async addNewArticle(req, res) {
        try {
            let {
                title,
                body,
                tags,
                category
            } = req.body;
            const item = await new Article({
                user: req.user._id,
                title,
                body,
                tags,
                images: req.file.filename,
                persianDate: [{
                    date: Moment.fullDate(),
                    time: Moment.fullTime()
                }],
                category: category == 'none' ? null : category
            }).save()
            res.json({
                success: true,
                item,
                msg: 'محصول اضافه شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }
    async editArticle(req, res) {
        try {
            let {
                title,
                body,
                tags,
                category
            } = req.body;
            let item = await Article.findByIdAndUpdate({
                _id: req.query.id
            }, {
                $set: {
                    title,
                    body,
                    tags,
                    persianDate: [{
                        date: Moment.fullDate(),
                        time: Moment.fullTime()
                    }],
                    category
                }
            }, {
                new: true
            })
            if (!item) {
                return this.back(req, res)
            }
            res.json({
                success: true,
                item,
                msg: 'مقاله با موفقیت ویرایش شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async destroyArticle(req, res) {
        try {
            const article = await Article.findOne({
                _id: req.query.id,
                user: req.user._id
            }).populate({path:'comments' , model:Comment}).exec()
            if (!article) {
                return res.json({
                    success: false,
                    msg: 'چنین مقاله ای در سیستم ثبت نشده است'
                })
            }
            if (article.images) {
                fs.unlink(path.join(__dirname, '../../public/images') + "/article/" + article.images, function (err) {
                    if (err) throw err;
                });
            }
            article.comments.forEach(comment => comment.remove());

            comment.remove();
            res.json({
                success: true,
                msg: 'مقاله حذف شد'
            })

        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async getAllArticle (req ,res){
        try {
            let limit = 20
            let page = req.query.page || 1 || "1"
            let count = await Article.countDocuments({
            })
            let divide = count / limit
            let countPage = Math.ceil(divide)
            let items = await Article.find({
               
            }).populate([{
                path: 'user',
                model: User,
                select: 'userName'
            }, {
                path: 'category',
                model: Category
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

    async singleArticle (req, res){
        try {
            
            let item = await Product.findOneAndUpdate({
                _id: req.query.id
            }, { $inc: { viewCount:1}},{new:true}).populate({
                path: 'category',
                model: Category,
                select: 'name'
            })
            // .populate('comments').exec()
            if (!item) {
                return this.back(req, res)
            }
            res.json({
                success:true,
                item,
                msg:'درخواست موفق'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }
}
module.exports = new articleController()