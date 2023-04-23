import { IUserWallet } from '../../models/interfaces/iUserWallet';
import { UserWalletInput } from '../../models/userWallet';

export interface IUserWalletRepository {
  persist: (userWallet: UserWalletInput) => Promise<IUserWallet>;
  fetch: (id: number) => Promise<IUserWallet | undefined>;
}
