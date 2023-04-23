import { Chain } from '../../../types/chain';
import { IBaseModel } from './iBaseModel';


export interface IUserWallet extends IBaseModel {
  userId: number;
  privateKey: string;
  chain: Chain;
  address: string;
}
