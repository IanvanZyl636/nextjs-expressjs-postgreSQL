import { IAverageSpeedModel } from './average-speed.model';
import { ITimeModel } from './time.model';

export interface IFastestLapModel {
  rank: string;
  lap: string;
  Time: ITimeModel;
  AverageSpeed: IAverageSpeedModel;
}
