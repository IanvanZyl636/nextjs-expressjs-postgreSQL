import { IConstructorModel } from './constructor.model';
import { IDriverModel } from './driver.model';
import { IFastestLapModel } from './fastest-lap.model';
import { ITimeModel } from './time.model';

export interface IResultModel {
  number: string;
  position: string;
  positionText: string;
  points: string;
  Driver: IDriverModel;
  Constructor: IConstructorModel;
  grid: string;
  laps: string;
  status: string;
  Time: ITimeModel;
  FastestLap: IFastestLapModel;
}
