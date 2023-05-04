import { IUserWallet } from '../models/interfaces/iUserWallet';
import { UserWallet } from '../models/userWallet';
import BaseRepository from './baseRepository';
import { IUserWalletRepository } from './interfaces/iUserWalletRepository';

class UserWalletRepository extends BaseRepository<UserWallet> implements IUserWalletRepository {
  async getByUserId(userId: number): Promise<IUserWallet[]> {
    return UserWallet.query().where('user_id', userId);
  }
}

const userWalletRepository = new UserWalletRepository(UserWallet);
export default userWalletRepository;
