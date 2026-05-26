import Joi from 'joi';

export const createTicketSchema = Joi.object({
  customer_name: Joi.string().min(2).max(120).required(),
  schedule_id: Joi.number().integer().positive().required(),
  seat_number: Joi.number().integer().min(1).required()
});
