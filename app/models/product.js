const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate')
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
});

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    type: {
        type: String,
        trim: true
    },
    images: {
        type: String,
        trim: true,
        default: 'avatar.png'
    },
    price: {
        type: Number,
        required: true
    },
    tags: {
        type: String,
        trim: true
    },
    viewCount: {
        type: Number,
        default: 0
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    commentCount: {
        type: Number,
        default: 0
    },

}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

ProductSchema.plugin(mongoosePaginate);
ProductSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'course'
})


ProductSchema.methods.inc = async function (field, num = 1) {
    this[field] += num;
    await this.save()
}



module.exports = AppSchema.model("Product", ProductSchema);