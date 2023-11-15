const {
  categorySchema,
  itemSchema,
  outletSchema,
  supplierSchema,
  transactionDetailSchema,
  transactionHeaderSchema,
  userAddSchema,
  userLoginSchema,
} = require("../schema");

const userLoginValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = userLoginSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({ status: "fail", message: `login failed, ${errorMessage}` });
  }

  next();
};

const userValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = userAddSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({ status: "fail", message: `add user failed, ${errorMessage}` });
  }

  next();
};

const transactionHeaderValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = transactionHeaderSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({
        status: "fail",
        message: `add transaction failed, ${errorMessage}`,
      });
  }

  next();
};

const transactionDetailValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = transactionDetailSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({
        status: "fail",
        message: `add transaction failed, ${errorMessage}`,
      });
  }

  next();
};

const itemValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = itemSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({ status: "fail", message: `add item failed, ${errorMessage}` });
  }

  next();
};

const outletValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = outletSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({ status: "fail", message: `add outlet failed, ${errorMessage}` });
  }

  next();
};

const supplierValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = supplierSchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({
        status: "fail",
        message: `add supplier failed, ${errorMessage}`,
      });
  }

  next();
};

const categoryValidator = (req, res, next) => {
  const dataToValidate = req.body;

  const { error } = categorySchema.validate(dataToValidate);

  if (error) {
    const errorMessage = error.details
      .map((detail) => detail.message)
      .join(", ");
    return res
      .status(400)
      .json({
        status: "fail",
        message: `add category failed, ${errorMessage}`,
      });
  }

  next();
};

module.exports = {
  transactionDetailValidator,
  transactionHeaderValidator,
  userValidator,
  userLoginValidator,
  itemValidator,
  outletValidator,
  supplierValidator,
  categoryValidator,
};
