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

  newCompanySchema: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    rate: Joi.string().required(),
    hours: Joi.string().required(),
    isCertified: Joi.boolean().required(),
    image: Joi.string().required()
  }),

  updateCompanySchema: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    rate: Joi.string(),
    hours: Joi.string(),
    isCertified: Joi.boolean(),
    image: Joi.string()
  })
};
