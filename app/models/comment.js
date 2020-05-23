const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate");
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const CommentSchema = mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      default: undefined,
    },
    article: {
      type: Schema.Types.ObjectId,
      ref: "Article",
      default: undefined,
    },
    comment: {
      type: String,
      required: true,
    },
    check: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
  },
  {
    timestampts: true,
    toJSON: { virtuals: true },
  }
);

CommentSchema.plugin(mongoosePaginate);

CommentSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

CommentSchema.virtual("autoSection", {
  ref: (doc) => {
    if (doc.product) return "Product";
    else if (doc.article) return "Article";
  },
  localField: (doc) => {
    if (doc.product) return "product";
    else if (doc.article) return "article";
  },

  foreignField: "_id",
  justOne: true,
});

module.exports = AppSchema.model("Comment", CommentSchema);
