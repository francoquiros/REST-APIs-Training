const Company = require("../models/company");

module.exports = {
  getCompanies: async (req, res) => {
    const allCompanies = await Company.find({}, (err, companies) => {
      res.status(200).send({ companies: companies });
    }).select(" -_id -__v");
  },
  getCompanyById: async (req, res) => {
    const company = await Company.findOne({ _id: req.params.id }).select(
      " -_id -__v"
    );
    if (!company)
      return res.status(404).send("The company with given ID was not found");
    res.status(200).send(company);
  },

  postCompany: async (req, res) => {
    const company = new Company({
      name: req.body.name,
      description: req.body.description,
      rate: req.body.rate,
      hours: req.body.hours,
      isCertified: req.body.isCertified,
      image: req.body.image
    });
    try {
      const savedCompany = await company.save();
      res.send(savedCompany);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  putCompany: async (req, res) => {
    const company = await Company.findOne({ _id: req.params.id });
    if (!company) return res.status(400).send("Company not found.");
    Company.findOneAndUpdate(
      {
        _id: req.params.id
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
  deleteCompany: async (req, res) => {
    Company.findOneAndDelete({ _id: req.params.id })
      .then(doc => {
        res.json(doc);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  }
};
