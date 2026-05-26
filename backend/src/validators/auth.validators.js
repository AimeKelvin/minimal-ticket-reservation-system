import Joi from 'joi';

export const registerSchema = Joi.object({
  fullname: Joi.string().min(2).max(120).required(),
  email: Joi.string().email().max(160).required(),
  phone: Joi.string().max(30).allow('', null),
  password: Joi.string().min(8).max(100).required(),
  role: Joi.string().valid('customer', 'fleetmanager').default('customer')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
