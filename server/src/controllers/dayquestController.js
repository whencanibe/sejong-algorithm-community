import { syncSingleUser } from '../jobs/syncSolvedListJob.js';
import { getDailyQuest, getDayquestStatus } from '../services/dayquestService.js';
import { buildFootprints, getStreak } from '../services/footprintService.js';


export async function getDayquestStatusCtrl(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    const result = await getDayquestStatus(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getFootprintsCtrl(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const footprints = await buildFootprints(userId);
    res.status(201).json({ footprints });
  } catch (e) { next(e); }
}

export async function getStreakCtrl(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const streak = await getStreak(userId);
    res.status(201).json({ streak });
  } catch (error) {
    next(error);
  }
}

export async function getFootprintsSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const footprints = await buildFootprints(userId);
    res.status(201).json({ footprints });
  } catch (e) { next(e); }
}

export async function getStreakSessionCtrl(req, res, next) {
  try {
    const userId = Number(req.session?.user?.id);
    const streak = await getStreak(userId);
    res.status(201).json({ streak });
  } catch (error) {
    next(error);
  }
}

export async function refreshDailyQuestCtrl(req, res, next) {
  try {
    const userId = req.session?.user?.id;
    await syncSingleUser(userId);         
        
    const status = await getDayquestStatus(userId);
    res.json(status);                     
  } catch (e) { next(e); }
}

export async function getDailyQuestCtrl(req, res, next) {
  try {
    const response = await getDailyQuest();
    return res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}