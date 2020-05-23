const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const ArticleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    trim: true,
  },
  tags: {
    type: String,
    trim: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  persianDate: [{
    date: {
      type: String,
      trim: true
    },
    time: {
      type: String,
      trim: true
    }
  }]
}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
});

ArticleSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "article",
});

ArticleSchema.methods.inc = async function (field, num = 1) {
  this[field] += num;
  await this.save();
};

const Article = AppSchema.model("Article", ArticleSchema);

module.exports = Article;