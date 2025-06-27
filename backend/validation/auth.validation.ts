import Joi from "joi";

export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string()
    .email({ tlds: { allow: ["com", "net", "org", "edu"] } })
    .required()
    .messages({
      "string.email": "Please provide a valid email address.",
    }),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
});

export const loginSchema = Joi.object({
  emailorUsername: Joi.string().required(),
  password: Joi.string().required(),
});
