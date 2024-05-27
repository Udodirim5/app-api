const NFT = require("./../models/nftModel");
const APIFeatures = require("./../utils/apiFeatures");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// TOP 5 NFTs
exports.eliesTopNFTs = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,difficulty";
  next();
};

//  GET REQUEST
exports.getAllNfts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(NFT.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const nfts = await features.query;

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    requestTime: req.requestTime,
    result: nfts.length,
    data: { nfts },
  });
});

//  CREATENFT
exports.createNft = catchAsync(async (req, res, next) => {
  const newNft = await NFT.create(req.body);
  res.status(201).json({
    status: "success",
    data: { nft: newNft },
  });
});

// GET SINGLE NFT
exports.getSingleNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findById(req.params.id);
  if (!nft) {
    return next(new AppError("No NFT found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      nft,
    },
  });
});

// UPDATE NFT
exports.updateNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });

  if (!nft) {
    return next(new AppError("No NFT found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: { nft },
  });
});

// DELETE NFT
exports.deleteNft = catchAsync(async (req, res, next) => {
  const nft = await NFT.findByIdAndDelete(req.params.id);

  if (!nft) {
    return next(new AppError("No NFT found with that ID", 404));
    }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// AGGREGATION PIPELINE
exports.getNftsStats = catchAsync(async (req, res, next) => {
  const stats = await NFT.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: "$difficulty" },
        numNfts: { $sum: 1 },
        numRating: { $sum: "$ratingQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    {
      $sort: { avgRating: 1 },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { stats },
  });
});

// CALCULATING THE NUMBER OF NFTs CREATED IN THE MONTH
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await NFT.aggregate([
    {
      $unwind: "$startDates",
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: "$startDates" },
        numNfts: { $sum: 1 },
        nfts: { $push: "$name" },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numNfts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    status: "success",
    data: { plan },
  });
});
