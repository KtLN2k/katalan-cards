import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.object({
    first: Joi.string().min(2).required(),
    middle: Joi.string().allow(""),
    last: Joi.string().min(2).required(),
  }),
  phone: Joi.string().min(9).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().min(6).required(),
  image: Joi.object({
    url: Joi.string().uri().allow(""),
    alt: Joi.string().allow(""),
  }),
  address: Joi.object({
    state: Joi.string().required(),
    country: Joi.string().required(),
    city: Joi.string().required(),
    street: Joi.string().required(),
    houseNumber: Joi.number().required(),
    zip: Joi.number().required(),
  }),
  isBusiness: Joi.boolean().required(),
});
