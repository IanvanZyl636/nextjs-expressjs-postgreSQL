import { Request, Response } from 'express';
import {
  getChampionBySeasonsQuerySchema,
  getRaceWinnersBySeasonQuerySchema,
} from '@nextjs-expressjs-postgre-sql/shared';
import {
  F1Service
} from '../../../services/f1/f1.service';

export const getChampionBySeasonsController = async (
  req: Request,
  res: Response
) => {
  const parsedQuery = {
    startYear: Number(req.query.startYear),
    endYear:
      req.query.endYear !== undefined ? Number(req.query.endYear) : undefined,
  };

  const validation = getChampionBySeasonsQuerySchema.safeParse(parsedQuery);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { startYear, endYear } = validation.data;

  return res.json((await F1Service.getChampionBySeasons(startYear, endYear)));
};

export const getRaceWinnersBySeasonController = async (
  req: Request,
  res: Response
) => {
  const parsedQuery = {
    seasonYear: Number(req.query.seasonYear),
  };

  const validation = getRaceWinnersBySeasonQuerySchema.safeParse(parsedQuery);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.errors });
  }

  const { seasonYear } = validation.data;
  
  const season = (await F1Service.getRaceWinnersBySeason(seasonYear));
  
  if(!season) {
    throw new Error('Season not found');
  }

  return res.json(season);
};
