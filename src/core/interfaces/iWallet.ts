import { IUserWallet } from '../../domain/models/interfaces/iUserWallet';
import { WalletMessage, WalletTransferData } from '../../types/wallet';

export default interface IWalletController {
  create: (userId: number) => Promise<string>;
  getById: (id: number) => Promise<IUserWallet| undefined>;
  getBalance: (address: string) => Promise<string>;
  getByUserId: (userId: number) => Promise<IUserWallet| undefined>;
  signMessage: (walletMessage: WalletMessage) => Promise<string>;
  sendTransaction: (walletTransferData: WalletTransferData) => Promise<string>;
}
