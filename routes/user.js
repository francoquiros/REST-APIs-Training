const router = require("express").Router();
const User = require("../models/user");
const {
  signupValidation,
  authValidation,
  updateValidation
} = require("../validation/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("./verifyToken");

// REGISTER
router.post("/signup", async (req, res) => {
  //DATA VALIDATION
  const { error } = signupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF EMAIL ALREADY EXISTS
  const userExists = await User.findOne({ username: req.body.username });
  if (userExists) return res.status(400).send("Username already exists");

  //HASH PASSWORD
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  // CREATE NEW USER
  const user = new User({
    name: req.body.name,
    username: req.body.username,
    password: hashedPassword
  });
  try {
    const savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send(err);
  }
});

// LOGIN

router.post("/auth", async (req, res) => {
  //DATA VALIDATION
  const { error } = authValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // CHECK IF EMAIL ALREADY EXISTS
  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send("Email not found");
  //PASSWORD IS CORRECT
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid password");

  //CREATE AND SIGN TOKEN
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: parseInt(process.env.TOKEN_EXPIRATION_TIME)
  });
  res.header("Authorization", token).send(token);
});

// GET ALL USERS
router.get("/", authenticate, (req, res) => {
  const allCompanies = User.find({}, (err, users) => {
    res.status(200).send({ users: users });
  }).select(" -_id -__v");
});

// GET USER BY USERNAME
router.get("/:username", authenticate, async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select(
    " -_id -__v"
  );
  if (!user)
    return res.status(404).send("The user with given username was not found");
  res.status(200).send(user);
});

// UPDATE USER BY USERNAME
router.put("/:username", authenticate, async (req, res) => {
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(400).send("User not found.");

  if (req.body.password) {
    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;
  }

  User.findOneAndUpdate(
    {
      username: req.params.username
    },
    req.body,
    {
      new: true
    }
  )
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

//DELETE USER

router.delete("/:username", authenticate, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(400).send("User not found.");

  User.findOneAndDelete({ username: req.params.username })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
