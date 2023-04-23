import { IBaseModel } from './iBaseModel';

export interface IUser extends IBaseModel {
  name?: string;
  email?: string;
}
