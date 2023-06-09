import { JsonRpcProvider, ethers } from 'ethers';
import IChain from '../interfaces/iChain';
import { WalletInfo, WalletMessage, WalletTransferData } from '../../types/wallet';
import * as bip39 from 'bip39';
import config from '../../infrastructure/config';

class Ether implements IChain {
  private getProvider(): JsonRpcProvider {
    return new ethers.JsonRpcProvider(config.infuraProvider.seopolia);
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
    const gasPrice: bigint = (await provider.getFeeData()).gasPrice || BigInt(0);
    const gasLimit = BigInt(21000);

    const tx = {
      to: toAddress,
      value: ethers.parseEther(amount),
      gasPrice: gasPrice && ethers.parseUnits(gasPrice.toString(), 'wei'),
      gasLimit,
    };

    try {
      const txResponse = await walletSigner.sendTransaction(tx);

      return txResponse?.hash;
    } catch (error: any) {
      throw new Error(error?.info?.error?.message || error?.message);
    }
  }
}

export default Ether;
