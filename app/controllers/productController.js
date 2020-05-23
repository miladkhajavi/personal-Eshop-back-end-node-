const controller = require('../controllers/controller')
const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Category = require("../models/category");
const Product = require("../models/product");
const fs = require('fs');
const path = require('path');
class productController extends controller {

    // async insertProduct(req, res, next) {
    //     let result = await this.validationData(req , res);
    //     if (result) {
    //         this.storeProcess(req, res, next);
    //     } else {
    //         if (req.file) {
    //             fs.unlinkSync(req.file.path)
    //         }
    //        return this.back(req, res);
    //     }
    // }

    async insertProduct(req, res) {
        try {
            let {
                title,
                body,
                type,
                price,
                tags,
                category
            } = req.body;
            const addProduct = await new Product({
                title,
                body,
                type,
                price,
                tags,
                images: req.file.filename,
                category: category == 'none' ? null : category
            }).save()
            res.json({
                success: true,
                addProduct,
                msg: 'محصول اضافه شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async editProduct(req, res) {
        try {
            let {
                title,
                body,
                type,
                price,
                tags,
                category
            } = req.body;
            let item = await Product.findOneAndUpdate({
                _id: req.query.id
            }, {
                $set: {
                    title,
                    body,
                    type,
                    price,
                    tags,
                    category: category == 'none' ? null : category

                }
            }, {
                new: true
            }).select({
                __v: 0,
                createdAt: 0
            })
            if (!item) {
                return this.back(req, res)
            }
            res.json({
                success: true,
                item,
                msg: 'محصول با موفقیت ویرایش شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async destroyProduct(req, res) {
        try {
            let item = await Product.findOneAndDelete({
                _id: req.query.id
            }).populate({path:'comments' , model:Comment}).exec();
            if (!item) {
                return this.back(req, res)
            }
            item.comments.forEach(comment => comment.remove());
            if (item.images) {
                fs.unlink(path.join(__dirname, '../../public/images') + "/product/" + item.images, function (err) {
                    if (err) throw err;
                });
            }
            res.json({
                success: true,
                msg: 'ماشین مورد نظر با موفقیت حذف شد'
            })

        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async allProducts(req, res) {
        try {
           
            
            let page = req.query.page || 1;
           
            let search = req.query.search;
           
            const item = await Product.paginate({
                title: {
                    $regex: search,
                    $options: 'i'
                }
            }, {
                page,
                limit: 10,
                sort: {
                    createdAt: -1
                },
                populate: {
                    path: 'category',
                    model: Category,
                    select: 'name'
                }
            })
            const categories = await Category.find({ parent: null }).populate('childs').exec();
            if (!item.docs || item.docs.length === 0) {
                return this.back(req, res)
            }
            res.json({
                success: true,
                item,
                categories,
                msg: 'درخواست انجام شد'
            })
        } catch (error) {
            res.status(400).json({
                Error: `Something went wrong. ${error}`,
            });
        }
    }

    async singleProducts(req, res) {
        try {
            
            let item = await Product.findOneAndUpdate({
                _id: req.query.id
            }, { $inc: { viewCount:1}},{new:true}).populate({
                // 
                path: 'category',
                model: Category,
                select: 'name'
            })
            .populate({path:'comments' , model:Comment}).exec()
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

module.exports = new productController()