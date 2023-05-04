import { encode } from 'punycode';
import ChainFactory from '../../src/business/factories/chainFactory';
import walletController from '../../src/core/wallet';
import userWalletRepository from '../../src/domain/repositories/userWalletRepository';
import { WalletMessage } from '../../src/types/wallet';
import Ether from '../../src/business/chains/ether';
import Wallet from '../../src/business/wallet';

describe('Wallet core', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('When creating new wallet', () => {
    it('should call chain to create and save result"', async () => {
      const mokedWallet = { address: 'fakeaddress', privateKey: 'fakeprivatekey' };
      const mokedEtherChain = { create: async () => mokedWallet } as any;
      jest.spyOn(ChainFactory, 'getChainByType').mockReturnValue(mokedEtherChain);
      const repoSpy = jest.spyOn(userWalletRepository, 'persist').mockReturnValue(mokedEtherChain);

      const result = await walletController.create(1);
      expect(repoSpy).toBeCalledWith({
        userId: 1,
        address: mokedWallet.address,
        privateKey: mokedWallet.privateKey,
        chain: 'ETHER',
      });
      expect(result).toBe(mokedWallet.address);
      expect(result).not.toBe(mokedWallet.privateKey);
    });
  });

  describe('When getting balance by user id', () => {
    it('if could not find user wallet, should throw "Wallet not found"', async () => {
      const mokedWallet = (async () => undefined)();
      jest.spyOn(userWalletRepository, 'getDefaultByUserId').mockReturnValue(mokedWallet);

      try {
        await walletController.getBalanceByUserId(1);
      } catch (error: any) {
        expect(error.message).toEqual('Wallet not found');
      }
    });

    it('should never return wallet private key', async () => {
      const mokedWallet = { id: 1, address: 'fakeaddress', privateKey: 'fakeprivatekey' } as any;
      const mokedWalletPromise = (async () => [mokedWallet])();
      const mokedBalance = '50000000000';
      const mokedBalancePromise = (async () => mokedBalance)();
      jest.spyOn(userWalletRepository, 'getDefaultByUserId').mockReturnValue(mokedWalletPromise as any);
      jest.spyOn(walletController, 'getBalance').mockReturnValue(mokedBalancePromise);

      const result = await walletController.getBalanceByUserId(1);

      expect((result as any).privateKey).toBeUndefined();
      expect(result.balance).toEqual(mokedBalance);
    });
  });

  describe('When actually calling chain to sign message', () => {
    it('should build the right factory and call its signMessage method', async () => {
      const mokedMessage = 'hello world';
      const encodedMokedMessage = encode(mokedMessage) || '';
      const walletMessage: WalletMessage = { message: encodedMokedMessage, privateKey: 'fakePrivateKey' };
      const wallet = new Wallet<Ether>(new Ether());

      jest.spyOn(ChainFactory, 'getChainByType').mockReturnValue(wallet);

      const mockSignMessage = jest.spyOn(wallet, 'signMessage').mockReturnValue(Promise.resolve(encodedMokedMessage));

      const result = await walletController.signMessage(walletMessage, 'ETHER');

      expect(ChainFactory.getChainByType).toHaveBeenCalledWith('ETHER');
      expect(mockSignMessage).toHaveBeenCalledWith(walletMessage);
      expect(result).toEqual(encodedMokedMessage);
    });
  });

  describe('When signing user message', () => {
    it('if could not find user wallet, should throw "Wallet not found"', async () => {
      const mokedWallet = (async () => undefined)();
      jest.spyOn(userWalletRepository, 'getDefaultByUserId').mockReturnValue(mokedWallet);

      try {
        await walletController.signUserMessage(1, 'hello world');
      } catch (error: any) {
        expect(error.message).toEqual('Wallet not found');
      }
    });

    it('should encode message before sending it forward', async () => {
      const mokedWallet = { id: 1, address: 'fakeaddress', privateKey: 'fakeprivatekey' } as any;
      const mokedMessage = 'hello world';
      const encodedMokedMessage = encode(mokedMessage);
      const walletMessage: WalletMessage = { message: encodedMokedMessage, privateKey: mokedWallet.privateKey };

      jest.spyOn(userWalletRepository, 'getDefaultByUserId').mockImplementation(() => Promise.resolve(mokedWallet));
      const controllerSpy = jest
        .spyOn(walletController, 'signMessage')
        .mockImplementation((_: WalletMessage) => Promise.resolve('fakeSignedMessage'));

      await walletController.signUserMessage(1, 'hello world');

      expect(controllerSpy).toBeCalledWith(walletMessage);
    });
  });
});
