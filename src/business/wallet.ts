import IChain from './interfaces/iChain';
import { WalletInfo, WalletMessage, WalletTransferData } from '../types/wallet';
import { BadRequestError } from '../infrastructure/express/errors';
import IWallet from './interfaces/iWallet';

export default class Wallet<T extends IChain> implements IWallet {
  constructor(private chain: T) {}

  public async create(): Promise<WalletInfo> {
    return await this.chain.create();
  }

  public async getBalance(address: string): Promise<string> {
    return this.chain.getBalance(address);
  }

  public async signMessage(walletMessage: WalletMessage): Promise<string> {
    return this.chain.signMessage(walletMessage);
  }

  public async sendTransaction(walletTransferData: WalletTransferData): Promise<string> {
    const { fromAddress, amount } = walletTransferData;
    const currBalance = await this.getBalance(fromAddress);

    if (Number(currBalance) < Number(amount)) {
      throw new BadRequestError('Not enough balance');
    }

    return this.chain.sendTransaction(walletTransferData);
  }
}
