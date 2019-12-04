// Validation
const Joi = require("@hapi/joi");

const companyValidation = data => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rate: Joi.string().required(),
    hours: Joi.string().required(),
    isCertified: Joi.boolean().required(),
    image: Joi.string().required()
  });
  return schema.validate(data);
};

module.exports.companyValidation = companyValidation;
