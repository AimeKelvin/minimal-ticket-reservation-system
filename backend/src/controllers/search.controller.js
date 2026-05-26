import { asyncHandler } from '../utils/asyncHandler.js';
import { searchSchedules, getAvailableSeats, getScheduleDetails, listCities } from '../services/search.service.js';

export const cities = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { cities: await listCities() } });
});

export const routes = asyncHandler(async (req,res)=> {
  const schedules = await searchSchedules(req.query);
  res.json({ success: true, data: { schedules } });
});

export const schedule = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { schedule: await getScheduleDetails(req.params.scheduleId) } });
});

export const seats = asyncHandler(async (req,res)=> {
  const seats = await getAvailableSeats(req.params.scheduleId);
  res.json({ success: true, data: { seats } });
});
