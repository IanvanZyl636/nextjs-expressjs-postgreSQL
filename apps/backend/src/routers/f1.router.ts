import { Router } from 'express';
import { getChampionBySeasonsController, getRaceWinnersBySeasonController } from '../controllers/f1.controller';
import { asyncHandler } from '../middleware/async-handler.middleware';

const router = Router();

router.get('/seasons/champions', asyncHandler(getChampionBySeasonsController));
router.get('/season/race-winners', asyncHandler(getRaceWinnersBySeasonController));

export default router;