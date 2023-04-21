import { WalletInfo, WalletMessage, WalletTransferData } from '../../types/wallet';

export default interface IChain {
  create: () => Promise<WalletInfo>;

  getBalance: (address: string) => Promise<string>;

  signMessage: (messageInfo: WalletMessage) => Promise<string>;

  sendTransaction: (walletTransferData: WalletTransferData) => Promise<string>;
}
