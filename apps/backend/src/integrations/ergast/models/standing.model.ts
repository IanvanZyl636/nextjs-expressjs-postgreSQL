import { IDriverStandingModel } from './driver-standing.model';

export interface IStandingModel {
  season: string;
  round: string;
  DriverStandings: IDriverStandingModel[];
}
