import { Chain } from '../types/chain';
import IWalletController from './interfaces/iWallet';
import { WalletInfo, WalletMessage, WalletTransferData } from '../types/wallet';
import ChainFactory from '../business/factories/chainFactory';
import { IUserWalletRepository } from '../domain/repositories/interfaces/iUserWalletRepository';
import userWalletRepository from '../domain/repositories/userWallet';

class WalletController implements IWalletController {
  constructor(private userWalletRepository: IUserWalletRepository) {}

  public async create(userId: number, chain: Chain = 'ETHER'): Promise<string> {
    const { address, privateKey } = await ChainFactory.getChainByType(chain).create();

    await this.userWalletRepository.persist({ userId, address, privateKey, chain });

    return address;
  }

  public async getBalance(address: string, chain: Chain = 'ETHER'): Promise<string> {
    return ChainFactory.getChainByType(chain).getBalance(address);
  }

  public async signMessage(walletMessage: WalletMessage, chain: Chain = 'ETHER'): Promise<string> {
    return ChainFactory.getChainByType(chain).signMessage(walletMessage);
  }

  public async sendTransaction(walletTransferData: WalletTransferData, chain: Chain = 'ETHER'): Promise<string> {
    return ChainFactory.getChainByType(chain).sendTransaction(walletTransferData);
  }
}

const walletController = new WalletController(userWalletRepository);
export default walletController;
