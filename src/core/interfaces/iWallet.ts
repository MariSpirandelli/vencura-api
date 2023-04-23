import { WalletMessage, WalletTransferData } from '../../types/wallet';

export default interface IWalletController {
  create: (userId: number) => Promise<string>;
  getBalance: (address: string) => Promise<string>;
  signMessage: (walletMessage: WalletMessage) => Promise<string>;
  sendTransaction: (walletTransferData: WalletTransferData) => Promise<string>;
}
