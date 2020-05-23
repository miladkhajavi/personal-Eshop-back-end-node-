const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
    },
     parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    }
  },
  {
    timestamps: true,
    toJSON : { virtuals : true }
  }
);

CategorySchema.virtual('childs', {
  ref : 'Category',
  localField : '_id',
  foreignField : 'parent'
})

const Category = AppSchema.model("Category", CategorySchema);

module.exports = Category;
