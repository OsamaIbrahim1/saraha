import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

export const sendMessageSchema = {
  body: Joi.object({
    content: Joi.string().required(),
  }),
  params: Joi.object({
    sendTo: generalRules.dbId,
  }),
};

export const deleteMessageSchema = {
  headers: generalRules.headersRules,
  query: Joi.object({
    messageId: generalRules.dbId,
  }),
};

export const markMessageAsViewedSchema = {
  headers: generalRules.headersRules,
  query: Joi.object({
    messageId: generalRules.dbId,
  }),
};
export const getUserMessagesSchema = {
  headers: generalRules.headersRules,
  query: Joi.object({
    isViewed: Joi.string().required(),
  }),
};
