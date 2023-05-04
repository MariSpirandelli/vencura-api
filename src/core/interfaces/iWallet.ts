import { IUserWallet } from '../../domain/models/interfaces/iUserWallet';
import { WalletBalanceInfo, WalletMessage, WalletTransferData } from '../../types/wallet';

export default interface IWalletController {
  create: (userId: number) => Promise<string>;
  getById: (id: number) => Promise<IUserWallet | undefined>;
  getBalanceByUserId(userId: number): Promise<WalletBalanceInfo>;
  getBalance: (address: string) => Promise<string>;
  getByUserId: (userId: number) => Promise<IUserWallet[]>;
  getDefaultByUserId: (userId: number) => Promise<IUserWallet | undefined>;
  signUserMessage: (userId: number, rawMessage: string) => Promise<string>
  signMessage: (walletMessage: WalletMessage) => Promise<string>;
  sendTransaction: (walletTransferData: WalletTransferData) => Promise<string>;
}
