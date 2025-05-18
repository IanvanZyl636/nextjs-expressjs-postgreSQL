import { getChampionBySeasons } from './f1.service';

describe('getChampionBySeasons', () => {
  it('run function', async () => {
    await getChampionBySeasons();
  });
});