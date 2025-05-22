import { z } from 'zod';
import { firstRecordedYear } from '../../../constants';

const lastYear = new Date().getFullYear() - 1;

export const getRaceWinnersBySeasonQuerySchema = z.object({
  seasonYear: z.number()
    .int()
    .max(lastYear, { message: `seasonYear cannot be greater than ${lastYear}` })
    .gte(firstRecordedYear, { message: `seasonYear cannot be less than ${firstRecordedYear}` })
})