import { IConstructorModel } from './constructor.model';
import { IDriverModel } from './driver.model';

export interface IDriverStandingModel {
  position: string;
  positionText: string;
  points: string;
  wins: string;
  Driver: IDriverModel;
  Constructors: IConstructorModel[];
}
