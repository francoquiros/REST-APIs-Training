const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const signToken = user =>
  jwt.sign(
    { _id: user._id, username: user.username },
    process.env.TOKEN_SECRET,
    {
      expiresIn: parseInt(process.env.TOKEN_EXPIRATION_TIME)
    }
  );
module.exports = {
  signUp: async (req, res) => {
    // CHECK IF EMAIL ALREADY EXISTS
    const userExists = await UserModel.findOne({ username: req.body.username });
    if (userExists) return res.status(400).send("Username already exists");

    // CREATE NEW USER
    const user = new UserModel({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password
    });
    try {
      const savedUser = await user.save();
      const token = signToken(savedUser);
      res.send({ token: token });
    } catch (err) {
      res.status(400).send(err);
    }
  },

  auth: async (req, res) => {
    const token = signToken(req.user);
    res.cookie("access_token", token, {
      httpOnly: true
    });
    res.header("Authorization", token).send(token);
  },

  getUsers: (req, res) => {
    const allCompanies = UserModel.find({}, (err, users) => {
      res.status(200).send({ users: users });
    }).select(" -_id -__v");
  },

  getUserById: async (req, res) => {
    const user = await UserModel.findOne({
      username: req.params.username
    }).select(" -_id -__v");
    if (!user)
      return res.status(404).send("The user with given username was not found");
    res.status(200).send(user);
  },

  putUserById: async (req, res) => {
    const { error } = updateValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await UserModel.findOne({ username: req.params.username });
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
  },

  deleteUserById: async (req, res) => {
    const user = await UserModel.findOne({ username: req.params.username });
    if (!user) return res.status(400).send("User not found.");

    UserModel.findOneAndDelete({ username: req.params.username })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
