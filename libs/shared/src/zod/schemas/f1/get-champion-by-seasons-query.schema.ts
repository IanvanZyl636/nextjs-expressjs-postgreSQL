import { z } from 'zod';
import { firstRecordedYear } from '../../../constants';

const lastYear = new Date().getFullYear() - 1;

export const getChampionBySeasonsQuerySchema = z.object({
  startYear: z.number()
    .int()
    .max(lastYear, { message: `startYear cannot be greater than ${lastYear}` })
    .gte(firstRecordedYear, { message: `startYear cannot be less than ${firstRecordedYear}` }),
  endYear: z.number()
    .int()
    .max(lastYear, { message: `endYear cannot be greater than ${lastYear}` })
    .optional(),
}).refine(data => {
  if (data.endYear !== undefined) {
    return data.startYear <= data.endYear;
  }
  return true;
}, {
  message: "startYear cannot be greater than endYear",
  path: ['startYear']
});