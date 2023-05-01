import { ethers } from 'ethers';
import IChain from '../../../src/business/interfaces/iChain';
import Ether from '../../../src/business/chains/ether';
import * as bip39 from 'bip39';

jest.mock('ethers');

describe('Ether', () => {
  const gasPriceRawValue = '21000';
  const defaultBalance = '1000000000000000000';
  const address = 'fakeAddress';
  const toAddress = 'fakeToAddress';
  const privateKey = 'fakePrivateKey';

  let providerMock: any = {
    getFeeData: () =>
      Promise.resolve({
        gasPrice: BigInt(gasPriceRawValue),
      }),
    getBalance: (_: string) => BigInt(defaultBalance),
  };
  let ether: IChain;

  beforeEach(() => {
    providerMock;
    ether = new Ether();
  });

  describe('create', () => {
    it('should create a new Ether wallet', async () => {
      const expectedWalletInfo = { address, privateKey };
      const fromPhraseMock = jest.fn(() => ({ connect: () => expectedWalletInfo }));
      jest.spyOn(bip39, 'generateMnemonic').mockReturnValue('test mnemonic');
      jest.spyOn(ethers.Wallet, 'fromPhrase').mockImplementation(fromPhraseMock as any);
      jest.spyOn(ether as any, 'getProvider').mockReturnValue(providerMock);

      const walletInfo = await ether.create();

      expect(walletInfo).toEqual(expectedWalletInfo);
      expect(fromPhraseMock).toHaveBeenCalledWith('test mnemonic');
    });
  });

  describe('getBalance', () => {
    it('should return the balance of an address', async () => {
      const getBalanceMock = jest.fn(() => defaultBalance);
      jest.spyOn(ether as any, 'getProvider').mockReturnValue({ getBalance: getBalanceMock } as any);

      const balance = await ether.getBalance(address);

      expect(balance).toEqual(defaultBalance);
      expect(getBalanceMock).toHaveBeenCalledWith(address);
    });
  });

  describe('signMessage', () => {
    it('should sign a message with the given private key', async () => {
      const signMessageMock = jest.fn((_: string | Uint8Array) => Promise.resolve(privateKey));
      jest.spyOn(ethers.Wallet.prototype, 'signMessage').mockImplementation(signMessageMock);

      const message = { message: 'test message', privateKey: privateKey };
      const signature = await ether.signMessage(message);

      expect(signature).toEqual(privateKey);
      expect(signMessageMock).toHaveBeenCalledWith('test message');
    });
  });

  describe('sendTransaction', () => {
    it('should send a transaction with the given parameters', async () => {
      const parseEtherMock = jest.fn((_: string) => BigInt(defaultBalance));
      const sendTransactionMock = jest.fn(() => ({ hash: address }));
      jest.spyOn(ethers, 'parseEther').mockImplementation(parseEtherMock);
      jest.spyOn(ethers.Wallet.prototype, 'connect').mockReturnValue({ sendTransaction: sendTransactionMock } as any);
      jest.spyOn(ether as any, 'getProvider').mockReturnValue(providerMock);

      const transaction = {
        fromPrivateKey: privateKey,
        fromAddress: address,
        toAddress,
        amount: '1',
      };
      const transactionHash = await ether.sendTransaction(transaction);

      expect(transactionHash).toEqual(address);
      expect(parseEtherMock).toHaveBeenCalledWith('1');
      expect(sendTransactionMock).toHaveBeenCalledWith({
        to: toAddress,
        value: BigInt(defaultBalance),
        gasPrice: undefined,
        gasLimit: BigInt(gasPriceRawValue),
      });
    });

    it('should throw an error if the transaction fails', async () => {
      const parseEtherMock = jest.fn((_: string) => BigInt(defaultBalance));
      const sendTransactionMock = jest.fn(() => {
        throw new Error('Transaction failed');
      });

      jest.spyOn(ethers, 'parseEther').mockImplementation(parseEtherMock);
      jest.spyOn(ethers.Wallet.prototype, 'connect').mockReturnValue({ sendTransaction: sendTransactionMock } as any);
      jest.spyOn(ether as any, 'getProvider').mockReturnValue(providerMock);

      const transaction = {
        fromPrivateKey: privateKey,
        fromAddress: address,
        toAddress,
        amount: '1',
      };
      // const transactionHash = await ether.sendTransaction(transaction);
      await expect(ether.sendTransaction(transaction)).rejects.toThrow('Transaction failed');
    });
  });
});
