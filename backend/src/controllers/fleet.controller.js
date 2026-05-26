import { asyncHandler } from '../utils/asyncHandler.js';
import * as service from '../services/fleet.service.js';
import { writeAudit } from '../middleware/audit.js';

const ok = (res, data, message='OK') => res.json({ success: true, message, data });

export const listBuses = asyncHandler(async (req,res)=> ok(res, { buses: await service.listBuses() }));
export const createBus = asyncHandler(async (req,res)=> { const bus = await service.createBus(req.body, req.session.user.user_id); await writeAudit(req,'CREATE','buses',bus.bus_id,req.body); res.status(201).json({success:true,message:'Bus created.',data:{bus}}); });
export const updateBus = asyncHandler(async (req,res)=> { const bus = await service.updateBus(req.params.id, req.body); await writeAudit(req,'UPDATE','buses',bus.bus_id,req.body); ok(res,{bus},'Bus updated.'); });
export const deleteBus = asyncHandler(async (req,res)=> { await service.deleteBus(req.params.id); await writeAudit(req,'DELETE','buses',req.params.id); ok(res,null,'Bus deleted.'); });

export const listRoutes = asyncHandler(async (req,res)=> ok(res, { routes: await service.listRoutes() }));
export const createRoute = asyncHandler(async (req,res)=> { const route = await service.createRoute(req.body, req.session.user.user_id); await writeAudit(req,'CREATE','routes',route.route_id,req.body); res.status(201).json({success:true,message:'Route created.',data:{route}}); });
export const updateRoute = asyncHandler(async (req,res)=> { const route = await service.updateRoute(req.params.id, req.body); await writeAudit(req,'UPDATE','routes',route.route_id,req.body); ok(res,{route},'Route updated.'); });
export const deleteRoute = asyncHandler(async (req,res)=> { await service.deleteRoute(req.params.id); await writeAudit(req,'DELETE','routes',req.params.id); ok(res,null,'Route deleted.'); });

export const listSchedules = asyncHandler(async (req,res)=> ok(res, { schedules: await service.listSchedules() }));
export const createSchedule = asyncHandler(async (req,res)=> { const schedule = await service.createSchedule(req.body, req.session.user.user_id); await writeAudit(req,'CREATE','schedules',schedule.schedule_id,req.body); res.status(201).json({success:true,message:'Schedule created.',data:{schedule}}); });
export const updateSchedule = asyncHandler(async (req,res)=> { const schedule = await service.updateSchedule(req.params.id, req.body); await writeAudit(req,'UPDATE','schedules',schedule.schedule_id,req.body); ok(res,{schedule},'Schedule updated.'); });
export const deleteSchedule = asyncHandler(async (req,res)=> { await service.deleteSchedule(req.params.id); await writeAudit(req,'DELETE','schedules',req.params.id); ok(res,null,'Schedule deleted.'); });
export const overview = asyncHandler(async (req,res)=> ok(res, { overview: await service.overview() }));
