const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcryptjs");
const AppSchema = mongoose.createConnection("mongodb://localhost/Eshop", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      minlength: 10,
    },

    role: {
      type: String,
      trim: true,
      required: true,
      enum: ["user", "admin", "superAdmin"],
    },

    email: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("لطفا ایمیل معتبر وارد کنید");
        }
      },
    },
    gender: {
      type: String,
      trim: true,
      enum: ["male", "female"],
    },
    address: {
      type: String,
      trim: true,
    },
    block: {
      type: Boolean,
      default:false
    },
    location: [
      {
        latitude: {
          type: String,
          trim: true,
        },
        longitude: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
  }
  }
);

// hash password
UserSchema.pre("save", function (next) {
  let user = this;
  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// compare password before and after
UserSchema.methods.comparePassword = function (Password, callBack) {
  bcrypt.compare(Password, this.password, (error, isMatch) => {
    if (error) {
      return callBack(error);
    }
    callBack(null, isMatch);
  });
};



const User = AppSchema.model("User", UserSchema);

module.exports = User;
