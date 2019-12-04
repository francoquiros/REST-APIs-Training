const router = require("express").Router();
const Company = require("../models/company");
const { companyValidation } = require("../validation/company");
const verify = require("./verifyToken");

router.get("/", (req, res) => {
  const allCompanies = Company.find({}, (err, companies) => {
    res.status(200).send({ companies: companies });
  }).select(" -_id -__v");
});

// Auth no required

router.get("/:id", async (req, res) => {
  const company = await Company.findOne({ _id: req.params.id }).select(
    " -_id -__v"
  );
  if (!company)
    return res.status(404).send("The company with given ID was not found");
  res.status(200).send(company);
});

router.post("/", verify, async (req, res) => {
  //DATA VALIDATION
  const { error } = companyValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
});

router.put("/:id", verify, async (req, res) => {
  const { error } = companyValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
});

router.delete("/:id", verify, async (req, res) => {
  const company = await Company.findOne({ _id: req.params.id });
  if (!company) return res.status(400).send("Company not found.");

  Company.findOneAndDelete({ _id: req.params.id })
    .then(doc => {
      res.json(doc);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

module.exports = router;
