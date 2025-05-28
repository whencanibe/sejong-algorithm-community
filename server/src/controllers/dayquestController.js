import { getDayquestStatus } from '../services/dayquestService.js';
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

export async function getSteakCtrl(req, res, next) {
  try {
    const userId = Number(req.params.id);
    const streak = await getStreak(userId);
    res.status(201).json({ streak });
  } catch (error) {
    next(error);
  }
}