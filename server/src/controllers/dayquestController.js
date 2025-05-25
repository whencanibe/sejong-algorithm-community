import { getDayquestStatus } from '../services/dayquestService.js';

export async function getDayquestStatusCtrl(req, res, next) {
  try {
    const userId = req.session?.user?.id;

    const result = await getDayquestStatus(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}