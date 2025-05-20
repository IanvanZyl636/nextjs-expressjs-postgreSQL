import { IRaceTableModel } from './race-table.model';
import { IStandingsTableModel } from './standings-table.model';

export interface IMRDataBaseModel {
  xmlns: string;
  series: string;
  url: string;
  limit: string;
  offset: string;
  total: string;
}

export interface IMRDataStandingsModel extends IMRDataBaseModel {
  StandingsTable: IStandingsTableModel;
}

export interface IMRDataRaceModel extends IMRDataBaseModel {
  RaceTable: IRaceTableModel;
}
