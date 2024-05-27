const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");

const nftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "an nft must have a name"],
      unique: true,
      trim: true,
      maxlength: [50, "nft name must not exceed 50 characters"],
      minlength: [8, "nft name must not be less than 8 characters"],
      // validate: [validator.isAlpha, "name must only be alphabets"],
    },

    slug: String,

    difficulty: {
      type: String,
      required: [true, "an nft must have a difficulty"],
      enum: {
        values: ["easy", "medium", "difficulty"],
        message: "difficulty must be easy, medium or difficulty",
      },
    },

    duration: {
      type: String,
      required: [true, "an nft must have a duration"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "an nft must have a group size"],
    },

    description: {
      type: String,
      trim: true,
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "must not be less than 1"],
      max: [5, "must not exceed 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    summary: {
      type: String,
      trim: true,
      required: (true, "must mave a summary"),
    },

    price: {
      type: Number,
      required: [true, "an nft must have a price"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "discount price ({VALUE}) must be less than original price",
      },
    },

    imageCover: {
      type: String,
      required: [true, "must have at least one image"],
    },

    startDates: {
      type: [Date],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretNfts: {
      type: Boolean,
      default: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

nftSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARE

// DOCUMENT MIDDLEWARE:
// can only run before .save(); or .create(); and will not work when trying to update the data
nftSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lowwer: true });
  next();
});

// QUERY MIDDLEWARE
// the middleware that determine the specific user that can have access to a perticular data from the database
nftSchema.pre(/^find/, function (next) {
  this.find({ secretNfts: { $ne: true } });
  next();
});

// AGGREGARE MIDDLEWARE
// Pre-aggregation middleware
nftSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretNfts: { $ne: true } } });
  next();
});

const NFT = mongoose.model("NFT", nftSchema);

module.exports = NFT;
