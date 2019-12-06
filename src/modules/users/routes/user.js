const router = require("express").Router();
const Passport = require("passport");
const PassportConfig = require("../../auth/passport.config");

const UserController = require("../controller/user");
const UserValidation = require("../validation/user");

const PassportLocal = Passport.authenticate("local", { session: false });
const PassportJWT = Passport.authenticate("jwt", { session: false });
// REGISTER
router.post(
  "/signup",
  UserValidation.validateBody(UserValidation.signUpSchema),
  UserController.signUp
);

// LOGIN
router.post(
  "/auth",
  UserValidation.validateBody(UserValidation.authSchema),
  PassportLocal,
  UserController.auth
);

// GET ALL USERS
router.get("/", PassportJWT, UserController.getUsers);

// GET USER BY USERNAME
router.get("/:username", PassportJWT, UserController.getUserById);

// UPDATE USER BY USERNAME
router.put("/:username", PassportJWT, UserController.putUserById);

//DELETE USER

router.delete("/:username", PassportJWT, UserController.deleteUserById);

module.exports = router;
