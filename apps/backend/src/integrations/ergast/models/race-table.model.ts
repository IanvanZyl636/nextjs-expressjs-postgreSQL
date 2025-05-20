import { IRaceModel } from './race.model';

export interface IRaceTableModel {
  season: string;
  position: string;
  Races: IRaceModel[];
}
