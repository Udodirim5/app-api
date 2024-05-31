const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "user must have a name"],
    trim: true,
    maxlength: [50, "nft name must not exceed 50 characters"],
    minlength: [2, "nft name must not be less than 2 characters"],
    // validate: [validator.isAlpha, "name must only be alphabets"],
  },

  email: {
    type: String,
    required: [true, "user must have an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "email must be a valid email address"],
  },

  photo: {
    type: String,
    default: "default.jpg",
  },

  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin", "creator", "guide"],
      message: "role must be admin creator guide or user",
    },
  },

  password: {
    type: String,
    required: [true, "user must have a password"],
    minlength: [8, "password must be at least 8 characters long"],
    maxlength: [249, "password must not exceed 249 characters"],
    select: false,
  },

  passwordConfirm: {
    type: String,
    required: [true, "user must confirm their password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same",
    },
  },
  passwordResetToken: {
    type: String,
    select: false,
  },

  passwordResetExpires: {
    type: Date,
    select: false,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },

  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // ENCRYPT THE PASSWORD
  this.password = await bcrypt.hashSync(this.password, 12);
  // PREVENT THE CONFIRM PASSWORD FROM STORING IN THE DATABASE
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    // WILL ONLY RUN WHEN A USER IS CHANGING THE PASSWORD
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // WILL RETURN FALSE BY DEFAULT
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
