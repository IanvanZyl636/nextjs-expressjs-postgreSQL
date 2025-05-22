import { Router } from 'express';
import { getChampionBySeasonsController, getRaceWinnersBySeasonController } from '../controllers/f1.controller';

const router = Router();

router.get('/seasons/champions', getChampionBySeasonsController);
router.get('/season/race-winners', getRaceWinnersBySeasonController);

export default router;