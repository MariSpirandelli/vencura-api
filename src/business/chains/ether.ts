import { JsonRpcProvider, ethers } from 'ethers';
import IChain from '../interfaces/iChain';
import { WalletInfo, WalletMessage, WalletTransferData } from '../../types/wallet';
import * as bip39 from 'bip39';
import config from '../../infrastructure/config';

class Ether implements IChain {
  private readonly PROVIDER: string = process.env.PROVIDER as string;
  // private readonly GAS_LIMIT: string = process.env.GAS_LIMIT as string;

  private getProvider(): JsonRpcProvider {
    return new ethers.JsonRpcProvider(config.infuraProvider.goerli);
  }

  public async create(): Promise<WalletInfo> {
    const provider = this.getProvider();
    const mnemonic = bip39.generateMnemonic(); // generates a new 12-word mnemonic
    const Ether = ethers.Wallet.fromPhrase(mnemonic).connect(provider);

    return { address: Ether.address, privateKey: Ether.privateKey };
  }

  public async getBalance(address: string): Promise<string> {
    const provider = this.getProvider();
    const balance = await provider.getBalance(address);

    return balance.toString();
  }

  public async signMessage({ message, privateKey }: WalletMessage): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);

    return wallet.signMessage(message);
  }

  public async sendTransaction({ fromPrivateKey, toAddress, amount }: WalletTransferData): Promise<string> {
    const wallet = new ethers.Wallet(fromPrivateKey);
    const provider = this.getProvider();
    const walletSigner = wallet.connect(provider);
    const gasPrice = (await provider.getFeeData()).gasPrice;
    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount),
      gasPrice: gasPrice && ethers.parseUnits(gasPrice.toString(), 'gwei'),
      // gasLimit: ethers.parseUnits(this.GAS_LIMIT, 'wei'),
    };

    const txResponse = await walletSigner.sendTransaction(tx);

    return txResponse.hash;
  }
}

export default Ether;
