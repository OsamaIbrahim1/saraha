import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const signUpSchema = {
  body: Joi.object({
    username: Joi.string().trim().lowercase().required(),
    email: Joi.string().trim().lowercase().required().email(),
    password: Joi.string().min(6).required(),
  }),
};

export const signInSchema = {
  body: Joi.object({
    username: Joi.string().trim().lowercase(),
    email: Joi.string().trim().lowercase().email(),
    password: Joi.string().min(6).required(),
  }),
};

export const uploadImageSchema = {
  headers: generalRules.headersRules,
};
export const deleteAccountSchema = {
  headers: generalRules.headersRules,
}
export const getUserDataSchema = {
  headers: generalRules.headersRules,
};

