// Validation
const Joi = require("@hapi/joi");

const signupValidation = data => {
  const schema = Joi.object({
    name: Joi.string()
      .min(6)
      .required(),
    username: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });
  return schema.validate(data);
};

const authValidation = data => {
  const schema = Joi.object({
    username: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });

  return schema.validate(data);
};

const updateValidation = data => {
  const schema = Joi.object({
    name: Joi.string().min(6),
    username: Joi.string().min(6),
    password: Joi.string().min(6)
  });

  return schema.validate(data);
};

module.exports.signupValidation = signupValidation;
module.exports.authValidation = authValidation;
module.exports.updateValidation = updateValidation;
