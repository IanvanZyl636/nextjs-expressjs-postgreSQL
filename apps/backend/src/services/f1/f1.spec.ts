import { getChampionBySeasons, getRaceWinnersBySeason } from './f1.service';
import {prisma} from '../../integrations/prisma';

describe('getChampionBySeasons', () => {
  it('run function', async () => {
    try {
      await Promise.all([
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005),
        getChampionBySeasons(2005)
      ]);
    }
    catch(e){
      console.error(e);
    }
  }, 99999);
});

describe('getRaceWinnersBySeason', () => {
  it('run function', async () => {
    try{
      await Promise.all([
        getRaceWinnersBySeason(2006),
        getRaceWinnersBySeason(2006)
      ]);
    }catch(e){
      console.error(e);
    }
  }, 99999);
});

afterAll(async () => {
  await prisma.$disconnect();
});