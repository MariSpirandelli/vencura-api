import { IUserWallet } from '../../models/interfaces/iUserWallet';
import { UserWallet } from '../../models/userWallet';
import { IBaseRepository } from './iBaseRepository';
export interface IUserWalletRepository extends IBaseRepository<UserWallet> {
  getDefaultByUserId: (userId: number) => Promise<IUserWallet | undefined>;
  getByUserId: (userId: number) => Promise<IUserWallet[]>;
}
