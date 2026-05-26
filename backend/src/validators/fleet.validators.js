import Joi from 'joi';

export const busSchema = Joi.object({
  plate_number: Joi.string().min(3).max(40).required(),
  total_seat: Joi.number().integer().min(1).max(80).required(),
  status: Joi.string().valid('active', 'maintenance', 'retired').default('active')
});

export const busUpdateSchema = Joi.object({
  plate_number: Joi.string().min(3).max(40),
  total_seat: Joi.number().integer().min(1).max(80),
  status: Joi.string().valid('active', 'maintenance', 'retired')
}).min(1);

export const routeSchema = Joi.object({
  source: Joi.string().min(2).max(120).required(),
  destination: Joi.string().min(2).max(120).invalid(Joi.ref('source')).required(),
  price: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid('active', 'disabled').default('active')
});

export const routeUpdateSchema = Joi.object({
  source: Joi.string().min(2).max(120),
  destination: Joi.string().min(2).max(120),
  price: Joi.number().precision(2).min(0),
  status: Joi.string().valid('active', 'disabled')
}).min(1);

export const scheduleSchema = Joi.object({
  bus_id: Joi.number().integer().positive().required(),
  route_id: Joi.number().integer().positive().required(),
  departure_time: Joi.date().iso().required(),
  arrival_time: Joi.date().iso().greater(Joi.ref('departure_time')).allow(null),
  status: Joi.string().valid('scheduled', 'boarding', 'departed', 'cancelled').default('scheduled')
});

export const scheduleUpdateSchema = Joi.object({
  bus_id: Joi.number().integer().positive(),
  route_id: Joi.number().integer().positive(),
  departure_time: Joi.date().iso(),
  arrival_time: Joi.date().iso().allow(null),
  status: Joi.string().valid('scheduled', 'boarding', 'departed', 'cancelled')
}).min(1);
