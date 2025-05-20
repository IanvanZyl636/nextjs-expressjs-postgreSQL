import { IStandingModel } from './standing.model';

export interface IStandingsTableModel {
  driverStandings: string;
  StandingsLists: IStandingModel[];
}
