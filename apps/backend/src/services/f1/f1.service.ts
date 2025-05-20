import prisma from '../../integrations/prisma';
import {
  createMissingSeasonFromErgastSeason, getMissingErgastSeasonWithSeasonRaces,
  getMissingErgastSeasonsWithSeasonRaces,
  getYearsInRange, upsertSeasonRaces
} from './f1.utils';

export const getChampionBySeasons = async (
  startYear: number,
  endYear?: number
) => {
  endYear = endYear ?? new Date().getFullYear() - 1;

  let seasons = await prisma.season.findMany({
    where: { year: { gte: startYear, lte: endYear } },
    include:{champion:true, championConstructor:true}
  });

  const allYears = getYearsInRange(startYear, endYear);
  const existingYears = new Set(seasons.map((s) => s.year));
  const missingYears = allYears.filter((year) => !existingYears.has(year));

  if (missingYears.length > 0) {
    const missingErgastSeasons = await getMissingErgastSeasonsWithSeasonRaces(
      startYear,
      endYear,
      missingYears
    );

    await Promise.all(missingErgastSeasons.map((missingErgastSeason) => createMissingSeasonFromErgastSeason(missingErgastSeason)))

    seasons = await prisma.season.findMany({
      where: { year: { gte: startYear, lte: endYear } },
      include:{champion:true, championConstructor:true}
    });
  }

  return seasons;
};

export const getRaceWinnersBySeason = async (
  seasonYear:number
)=> {
  let season = await prisma.season.findUnique({
    where: { year: seasonYear },
    include:{champion:true, championConstructor:true, races:true}
  });

  if(!season){
    const ergastSeason = await getMissingErgastSeasonWithSeasonRaces(seasonYear);
    await createMissingSeasonFromErgastSeason(ergastSeason);

    season = await prisma.season.findUnique({
      where: { year: seasonYear },
      include:{champion:true, championConstructor:true, races:true}
    });
  }

  if(season?.races?.length === 0){
    await upsertSeasonRaces(season.id, seasonYear);
  }
}
