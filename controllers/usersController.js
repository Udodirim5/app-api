const User = require("./../models/usersModel");
const catchAsync = require("./../utils/catchAsync");

// USERS CONTROLLERS
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
