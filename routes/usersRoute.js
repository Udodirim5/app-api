const express = require("express");

const usersControllers = require("./../controllers/usersController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);

router.patch("/updateMe", authController.protect, usersControllers.updateMe);
router.delete("/deleteMe", authController.protect, usersControllers.deleteMe);

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
