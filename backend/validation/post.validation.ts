import Joi from "joi";

export const postSchema = Joi.object({
  caption: Joi.string().max(500).allow(""),
});
export const commentSchema = Joi.object({
  postId: Joi.number().integer().required(),
  content: Joi.string().min(1).required(),
});
export const updateProfileValidationSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  bio: Joi.string().optional(),
  profile: Joi.optional(),
});
