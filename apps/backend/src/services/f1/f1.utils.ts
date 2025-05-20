import {
  getDriverStandings,
  getSeasonResults,
} from '../../integrations/ergast/ergast.service';
import { IDriverStandingModel } from '../../integrations/ergast/models/driver-standing.model';
import prisma from '../../integrations/prisma';
import { IStandingModel } from '../../integrations/ergast/models/standing.model';
import { IDriverModel } from '../../integrations/ergast/models/driver.model';
import { IConstructorModel } from '../../integrations/ergast/models/constructor.model';
import { ICircuitModel } from '../../integrations/ergast/models/circuit.model';
import { ILocationModel } from '../../integrations/ergast/models/location.model';
import { Prisma } from '../../integrations/prisma/generated';

export function getYearsInRange(startYear: number, endYear: number) {
  const allYears: number[] = [];

  for (let year = startYear; year <= endYear; year++) {
    allYears.push(year);
  }

  return allYears;
}

export const getMissingErgastSeasonsWithSeasonRaces = async (
  startYear: number,
  endYear: number,
  missingYears: number[]
) => {
  const ergastDriverStandings = (await getDriverStandings(startYear, endYear))
    .MRData.StandingsTable.StandingsLists;

  if (ergastDriverStandings.length !== missingYears.length) {
    throw new Error(
      `getMissingSeasons(${startYear}, ${endYear}, [${missingYears.join(
        ', '
      )}]) Missing seasons mismatch`
    );
  }

  return ergastDriverStandings;
};

export const getMissingErgastSeasonWithSeasonRaces = async (
  seasonYear: number
) => {
  const ergastSeason = (await getDriverStandings(seasonYear, seasonYear))
    ?.MRData?.StandingsTable?.StandingsLists?.[0];

  if (!ergastSeason) {
    throw new Error(`getMissingErgastSeason(${seasonYear} no season found`);
  }

  return ergastSeason;
};

export const createMissingSeasonFromErgastSeason = async (
  ergastSeason: IStandingModel
) => {
  const year = Number(ergastSeason.season);
  const driverStanding = ergastSeason.DriverStandings?.[0] as
    | IDriverStandingModel
    | undefined;
  const driver = driverStanding?.Driver;
  const constructor = driverStanding?.Constructors?.[0];

  if (!driver || !constructor) {
    throw new Error('Driver or Constructor data is missing');
  }

  const savedDriver = await upsertDriver(driver);
  const savedConstructor = await upsertConstructor(constructor);

  const newSeason = await prisma.season.upsert({
    where: {
      year,
    },
    update: {},
    create: {
      year,
      championId: savedDriver.id,
      championConstructorId: savedConstructor.id,
    },
  });

  await upsertSeasonRaces(newSeason.id, year);
};

export const upsertDriver = async (ergastDriver: IDriverModel) => {
  try {
    return await prisma.driver.upsert({
      where: {
        driverId: ergastDriver.driverId,
      },
      create: {
        driverId: ergastDriver.driverId,
        fullName: ergastDriver.familyName,
        code: ergastDriver.code,
        nationality: ergastDriver.nationality,
      },
      update: {},
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      const driver = await prisma.driver.findUnique({
        where: {
          driverId: ergastDriver.driverId,
        },
      });

      if (!driver) throw new Error('upsertDriver() driver not found');

      return driver;
    }
    throw e;
  }
};

export const upsertConstructor = async (
  ergastConstructor: IConstructorModel
) => {
  try {
    return await prisma.constructor.upsert({
      where: {
        constructorId: ergastConstructor.constructorId,
      },
      create: {
        constructorId: ergastConstructor.constructorId,
        name: ergastConstructor.name,
        nationality: ergastConstructor.nationality,
      },
      update: {},
    });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2002'
    ) {
      const constructor = await prisma.constructor.findUnique({
        where: {
          constructorId: ergastConstructor.constructorId,
        },
      });

      if (!constructor)
        throw new Error('upsertConstructor() constructor not found');

      return constructor;
    }
    throw e;
  }
};

export const upsertCircuit = (locationId: string, circuit: ICircuitModel) => {
  return prisma.circuit.upsert({
    where: {
      circuitId: circuit.circuitId,
    },
    create: {
      circuitId: circuit.circuitId,
      circuitName: circuit.circuitName,
      locationId,
    },
    update: {},
  });
};

export const upsertLocation = (location: ILocationModel) => {
  return prisma.location.upsert({
    where: {
      lat_long: {
        lat: location.lat,
        long: location.long,
      },
    },
    create: {
      lat: location.lat,
      long: location.long,
      locality: location.locality,
      country: location.country,
    },
    update: {},
  });
};

export const upsertSeasonRaces = async (
  seasonId: string,
  seasonYear: number
) => {
  const ergastSeasonRaces = (await getSeasonResults(seasonYear)).MRData
    .RaceTable.Races;

  for (const ergastRace of ergastSeasonRaces) {
    const ergastRaceCircuit = ergastRace.Circuit;
    const ergastRaceCircuitLocation = ergastRaceCircuit.Location;
    const ergastRaceWinnerResult = ergastRace.Results?.[0];
    const ergastRaceWinnerDriver = ergastRaceWinnerResult?.Driver;
    const ergastRaceWinnerDriverConstructor =
      ergastRaceWinnerResult?.Constructor;

    if (
      !ergastRaceWinnerDriver ||
      !ergastRaceWinnerDriverConstructor ||
      !ergastRaceCircuitLocation ||
      !ergastRaceCircuit
    ) {
      throw new Error(`upsertSeasonRaces(${seasonId}) ergast data missing
        {
          ergastRaceCircuit: ${ergastRaceCircuit},
          ergastRaceCircuitLocation: ${ergastRaceCircuitLocation},
          ergastRaceWinnerDriver: ${ergastRaceWinnerDriver},
          ergastRaceWinnerDriverConstructor: ${ergastRaceWinnerDriverConstructor}
        }
      `);
    }

    const savedCircuitLocation = await upsertLocation(
      ergastRaceCircuitLocation
    );
    const savedCircuit = await upsertCircuit(
      savedCircuitLocation.id,
      ergastRaceCircuit
    );
    const savedDriver = await upsertDriver(ergastRaceWinnerDriver);
    const savedConstructor = await upsertConstructor(
      ergastRaceWinnerDriverConstructor
    );

    await prisma.race.upsert({
      where: {
        seasonId_round: {
          seasonId,
          round: Number(ergastRace.round),
        },
      },
      update: {},
      create: {
        name: ergastRace.raceName,
        round: Number(ergastRace.round),
        startedAt: new Date(`${ergastRace.date}T${ergastRace.time}`),
        points: Number(ergastRaceWinnerResult.points),
        laps: Number(ergastRaceWinnerResult.laps),
        seasonId,
        circuitId: savedCircuit.id,
        winnerId: savedDriver.id,
        winnerConstructorId: savedConstructor.id,
      },
    });
  }
};
