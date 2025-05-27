import { Prisma } from '../generated';
import { seasonWithChampionAndConstructorQuery, seasonWithRacesQuery } from '../queries';

export type SeasonWithChampionAndConstructorEntity = Prisma.SeasonGetPayload<typeof seasonWithChampionAndConstructorQuery>

export type SeasonWithRacesEntity = Prisma.SeasonGetPayload<typeof seasonWithRacesQuery>