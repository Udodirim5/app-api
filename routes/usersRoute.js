const express = require("express");

const usersControllers = require("./../controllers/usersController");

const router = express.Router();

router
  .route("/")
  .get(usersControllers.getAllUsers)
  .post(usersControllers.createUser);

router
  .route("/:id")
  .get(usersControllers.getSingleUser)
  .patch(usersControllers.updateUser)
  .delete(usersControllers.deleteUser);

module.exports = router;
