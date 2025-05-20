import { ILocationModel } from './location.model';

export interface ICircuitModel {
  circuitId: string;
  url: string;
  circuitName: string;
  Location: ILocationModel;
}
