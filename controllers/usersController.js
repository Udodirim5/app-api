const fs = require("fs");

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/../nft-data/data/nft-users.json`)
);

// USERS CONTROLLERS
// GET USERS
exports.getAllUsers = (req, res) => {
  res.status(201).json({
    status: "success",
    requestTime: req.requestTime,
    result: users.length,
    data: { users },
  });
};

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
