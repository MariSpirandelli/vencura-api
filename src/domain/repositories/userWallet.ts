import { IUserWallet } from '../models/interfaces/iUserWallet';
import { UserWalletInput, UserWallet } from '../models/userWallet';
import { IUserWalletRepository } from './interfaces/iUserWalletRepository';

class UserWalletRepository implements IUserWalletRepository {
  async persist(userWallet: UserWalletInput): Promise<IUserWallet> {
    return await UserWallet.query().insert(userWallet).returning('*');
  }

  async fetch(id: number): Promise<IUserWallet | undefined> {
    return UserWallet.query().where({ id }).select().first();
  }
}

const userWalletRepository = new UserWalletRepository();
export default userWalletRepository;
