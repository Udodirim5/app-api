const User = require("./../models/usersModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

// Utility function to filter allowed fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// USERS CONTROLLERS
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1. Ensure that the route is not for updating passwords
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  // 2. Filter the request body to include only allowed fields
  const filteredBody = filterObj(req.body, "name", "email");
  // FIXME: USER GET LOGGED OUT WHEN DATA IS UPDATED

  // 3. Update the user data
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  // 4. Send the response with the updated user data
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // Update the user's active status to false
  await User.findByIdAndUpdate(req.user.id, { active: false });

  // Send the response
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// GET USERS
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(201).json({
    status: "success",
    result: users.length,
    data: { users },
  });
});

// CREATE USER
exports.createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

// GET SINGLE USER
exports.getSingleUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

// UPDATE USER
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

// DELETE USER
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
