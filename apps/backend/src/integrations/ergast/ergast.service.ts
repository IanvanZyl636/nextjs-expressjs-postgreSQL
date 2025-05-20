import {
  IMRDataRaceModel,
  IMRDataStandingsModel,
} from './models/mr-data.model';
import axios from 'axios';
import { getDriverStandingsLimitOffset } from './ergast.utils';
import { ergastRootApi } from './ergast.constants';

export const getDriverStandings = async (
  startYear: number,
  endYear?: number
) => {
  const { limit, offset } = getDriverStandingsLimitOffset(startYear, endYear);

  return (
    await axios.get<{ MRData: IMRDataStandingsModel }>(
      `${ergastRootApi}/driverStandings/1.json?limit=${limit}&offset=${offset}`
    )
  ).data;
};

export const getSeasonResults = async (year: number) =>
  (
    await axios.get<{ MRData: IMRDataRaceModel }>(
      `${ergastRootApi}/${year}/results/1.json`
    )
  ).data;
