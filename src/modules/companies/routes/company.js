const router = require("express").Router();

const CompanyController = require("../controller/company");
const CompanyValidation = require("../validation/company");

const Passport = require("passport");
const PassportConfig = require("../../auth/passport.config");

const passportValidation = Passport.authenticate("jwt", { session: false });

//ROUTES

router.get("/", CompanyController.getCompanies);

router.get("/:id", CompanyController.getCompanyById);

router.post(
  "/",
  CompanyValidation.validateBody(CompanyValidation.newCompanySchema),
  passportValidation,
  CompanyController.postCompany
);

router.put(
  "/:id",
  CompanyValidation.validateBody(CompanyValidation.updateCompanySchema),
  passportValidation,
  CompanyController.putCompany
);

router.delete("/:id", passportValidation, CompanyController.deleteCompany);

module.exports = router;
