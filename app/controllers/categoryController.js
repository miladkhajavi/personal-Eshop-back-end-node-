const controller = require('../controllers/controller')
const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Category = require("../models/category");

class categoryController extends controller {

  async insertCategory(req, res) {
    try {
      let {
        name,
        parent
      } = req.body;
      let existCategory = await Category.findOne({
        name
      })
      if (existCategory) {
        return res.status(404).json({
          success: false,
          msg: 'این دسته بندی قبلا ایجاد شده است'
        })
      } else {
        let item = await new Category({
          name,
          parent: parent == 'none' ? null : parent
        }).save()
        return res.json({
          success: true,
          item,
          msg: 'دسته بندی اضافه شد'
        })
      }
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  }
  async editCategory(req, res) {
    try {
      let {
        name,
        parent
      } = req.body;
      let item = await Category.findOneAndUpdate({
        _id: req.query.id
      }, {
        $set: {
          name,
          parent: parent == 'none' ? null : parent
        }
      }, {
        new: true
      }).select({
        "createdAt": 0,
        "updatedAt": 0,
        "__v": 0
      });
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: 'خطا در دریافت اطلاعات'
        })
      }
      res.json({
        success: false,
        item,
        msg: 'دسته بندی ویرایش شد'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  }
  async destroyCategory(req, res) {
    try {
      let category = await Category.findOne({
        _id: req.query.id
      }).populate('childs').exec()
      if (!category) {
        return res.json({
          success: false,
          msg: 'چنین دسته بندی در سایت ثبت نشده است'
        })
      }
      // delete category
      category.childs.forEach(category => category.remove());
      category.remove();
      res.json({
        success: true,
        msg: 'دسته بندی با موفقیت حذف شد'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  }
  async allCategories(req, res) {
    try {
      let items = await Category.find({}).populate('childs').select({
        "__v": 0
      }).sort({
        updatedAt: -1
      }).exec()
      if (!items || items.length == 0) {
        return res.status(404).json({
          success: false,
          msg: 'خطا در دریافت اطلاعات'
        })
      }
      res.json({
        success: true,
        items,
        msg: 'درخواست موفق'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  }

  async singleCategories(req, res) {
    try {
      let item = await Category.findOne({
        _id: req.query.id
      }).populate('childs').select({
        "createdAt": 0,
        "updatedAt": 0,
        "__v": 0
      })
      if (!item) {
        return res.status(404).json({
          success: false,
          msg: 'خطا در دریافت اطلاعات'
        })
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
};
module.exports = new categoryController()