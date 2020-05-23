const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    trim: true,
    required: true
  },
  order: [{
    _id:false,
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      trim: true
    },
    count: {
      type: Number,
      trim: true,
      default: 1
    },
    persianDate: [{
      _id:false,
      date: {
        type: String,
        trim: true
      },
      time: {
        type: String,
        trim: true
      }
    }]
  }]
}, {
  timestamps: true
});


module.exports = AppSchema.model("Cart", CartSchema);