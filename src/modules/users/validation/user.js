// Validation
const Joi = require("@hapi/joi");

module.exports = {
  validateBody: schema => {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error)
        return res.status(400).send({ message: error.details[0].message });
      next();
    };
  },

  authSchema: Joi.object({
    username: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  }),

  signUpSchema: Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    username: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  }),

  updateSchema: Joi.object({
    name: Joi.string().min(6),
    username: Joi.string().min(6),
    password: Joi.string().min(6)
  })
};
