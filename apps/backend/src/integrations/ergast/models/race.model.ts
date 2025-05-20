import { ICircuitModel } from './circuit.model';
import { IResultModel } from './result.model';

export interface IRaceModel {
  season: string;
  round: string;
  url: string;
  raceName: string;
  Circuit: ICircuitModel;
  date: string;
  time: string;
  Results: IResultModel[];
}
