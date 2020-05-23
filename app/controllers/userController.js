const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Moment = require("../middleware/date");

module.exports = {
  async showProfile(req, res) {
    try {
      if (req.query.id) {
        var id = req.query.id;
      } else {
        id = req.user._id;
      }
      let item = await User.findOne({
          _id: id
        }, {
          password: 0,
          __v: 0
        })
        .populate([{
          path: "article",
          model: Article
        }, {
          path: "comments",
          model: Comment
        }])
        .exec();

      if (!item) {
        return res.status(404).json({
          success: false,
          msg: "خطا در دریافت اطلاعات"
        });
      }
      res.json({
        success: true,
        item,
        msg: ''
      });
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  },
  async editProfile(req, res) {
    try {
      let {
        firstName,
        lastName,
        email,
        address,
        gender
      } = req.body
      let item = await User.findOneAndUpdate({
        _id: req.user.id
      }, {
        $set: {
          firstName,
          lastName,
          email,
          address,
          gender,
          location: [{
            latitude: req.body.latitude,
            longitude: req.body.longitude
          }]
        }
      }, {
        new: true
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
        msg: 'کاربر با موفقیت ویرایش شد'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  },

  async addToCart(req, res) {
    try {

      let items = await Cart.findOneAndUpdate({
        user: req.user._id,
        'order.product': {
          $ne: req.query.product
        }
      }, {
        $push: {
          order: [{
            product: req.query.product,
            count: req.query.count,
            persianDate: [{
              date: Moment.fullDate(),
              time: Moment.fullTime()
            }],
          }]
        }
      }, {
        new: true
      }).populate({
        path: 'order.product',
        model: Product
      })
      if (!items) {
        return res.json({
          success: false,
          msg: 'محصول موردنظر قبلا انتخاب شده'
        })
      }

      res.json({
        success: true,
        items,
        msg: 'محصول با موفقیت به سبد خرید اضافه شد '
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  },

  async getItemsCart(req, res) {
    try {


      let item = await Cart.findOne({
        user: req.user._id
      }).populate({
        path: 'order.product',
        model: Product
      }).populate({
        path: 'user',
        model: User,
        select: 'firstName lastName userName avatar mobile location address gender'
      })
      if (!item) {
        return res.json({
          success: false,
          msg: 'خطا در دریافت اطلاعات'
        })
      }

      let total = 0
      for (let i = 0; i < item.order.length; i++) {
        total += item.order[i].product.price * item.order[i].count
      }



      res.json({
        success: true,
        item,
        total,
        msg: 'اطلاعات دریافت شد'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  },
  async destroyedItemsCart(req, res) {
    try {
      console.log(req.query);

      let item = await Cart.findOneAndUpdate({
        user: req.user._id
      }, {
        "$pull": {
          "order": {
            "product": req.query.product
          }
        }
      }, {
        new: true
      }).populate({
        path: 'order.product',
        model: Product
      })
      if (!item) {
        return res.json({
          success: false,
          msg: 'خطا در دریافت اطلاعات'
        })
      }
      res.json({
        success: true,
        item,
        msg: 'عملیات موفق'
      })
    } catch (error) {
      res.status(400).json({
        Error: `Something went wrong. ${error}`,
      });
    }
  }
};