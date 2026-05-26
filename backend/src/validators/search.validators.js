import Joi from 'joi';

export const routeSearchSchema = Joi.object({
  source: Joi.string().min(2).max(120).required(),
  destination: Joi.string().min(2).max(120).required(),
  date: Joi.date().iso().required()
});
