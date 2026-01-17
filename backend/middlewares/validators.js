import joi from "joi";

const userSchemaLogin = joi.object({
  email: joi.string().email().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  password: joi.string().min(8).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
}).required();

const loginValidator = (req, res, next) => {
  const { error } = userSchemaLogin.validate(req.body, { abortEarly: false });
  if (error) {
    console.log("Login validation error. Payload:", req.body, "Errors:", error.details.map(err => err.message));
    return res.status(422).json({
      errors: error.details.map(err => err.message),
    });
  }
  next();
};

const userSchemaSignup = joi.object({
  fullName: joi.string().min(2).max(50).required().messages({
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 2 characters",
    "string.max": "Full name must be at most 50 characters",
  }),
  email: joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),
  phone: joi.string().pattern(/^[0-9]{7,15}$/).required().messages({
    "string.empty": "Phone is required",
    "string.pattern.base": "Enter a valid phone number",
  }),
  password: joi.string().min(8).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
  userType: joi.string().valid("seller", "buyer", "admin").required().messages({
    "any.only": "User type must be seller, buyer, or admin",
    "string.empty": "User type is required",
  }),
}).required();

const signupValidator = (req, res, next) => {
  const { error } = userSchemaSignup.validate(req.body, { abortEarly: false });
  if (error) {
    console.log("Signup validation error. Payload:", req.body, "Errors:", error.details.map(err => err.message));
    return res.status(422).json({
      errors: error.details.map(err => err.message),
    });
  }
  next();
};

const userSchemaUpdate = joi.object({
  fullName: joi.string().min(2).max(50).messages({
    'string.min': 'Full name must be at least 2 characters',
    'string.max': 'Full name cannot exceed 50 characters',
  }),
  email: joi.string().email().messages({
    'string.email': 'Please enter a valid email address',
  }),
  phone: joi.string().pattern(/^[0-9]{7,15}$/).messages({
    'string.pattern.base': 'Phone number must be 7-15 digits',
  }),
  currentPassword: joi.string().min(8).messages({
    'string.min': 'Current password must be at least 8 characters',
  }),
  newPassword: joi.string().min(8).messages({
    'string.min': 'New password must be at least 8 characters',
  }),
}).with('newPassword', 'currentPassword');

const updateValidator = (req, res, next) => {
  const { error } = userSchemaUpdate.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(422).json({
      errors: error.details.map(err => err.message),
    });
  }
  next();
};

export { loginValidator, signupValidator, updateValidator};
