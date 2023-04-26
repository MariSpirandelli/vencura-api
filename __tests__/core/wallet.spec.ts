import ChainFactory from '../../src/business/factories/chainFactory';
import walletController from '../../src/core/wallet';
import userWalletRepository from '../../src/domain/repositories/userWalletRepository';

describe('Wallet core', () => {
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
      const mokedWallet = (async () => [])();
      jest.spyOn(userWalletRepository, 'getByUserId').mockReturnValue(mokedWallet);

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
      jest.spyOn(userWalletRepository, 'getByUserId').mockReturnValue(mokedWalletPromise);
      jest.spyOn(walletController, 'getBalance').mockReturnValue(mokedBalancePromise);

      const result = await walletController.getBalanceByUserId(1);

      expect((result as any).privateKey).toBeUndefined();
      expect(result.balance).toEqual(mokedBalance);
    });
  });

  describe('When signing user message', () => {
    it('if could not find user wallet, should throw "Wallet not found"', async () => {
      const mokedWallet = (async () => [])();
      jest.spyOn(userWalletRepository, 'getByUserId').mockReturnValue(mokedWallet);

      try {
        await walletController.signUserMessage(1, 'hello world');
      } catch (error: any) {
        expect(error.message).toEqual('Wallet not found');
      }
    });
  });
});
