import Ether from '../../src/business/chains/ether';
import ChainFactory from '../../src/business/factories/chainFactory';

describe('Wallet chain', () => {
  describe('When sending transaction', () => {
    const walletTransferData = {
      fromAddress: 'fakefromAddress',
      fromPrivateKey: 'fakefromPrivateKey',
      toAddress: 'faketoAddress',
      amount: '0.000001',
    };
    const chain = ChainFactory.getChainByType('ETHER');
    it('should throw "Not enough balance" error if user does not have enough balance', async () => {
      jest.spyOn(chain, 'getBalance').mockResolvedValue('0');
      try {
        await chain.sendTransaction(walletTransferData);
      } catch (error: any) {
        expect(error.message).toBe('Not enough balance');
      }
    });

    it('should throw "Not enough balance" error if user does not have enough balance', async () => {
      jest.spyOn(chain, 'getBalance').mockResolvedValue('50000000000');
      jest.spyOn(Ether.prototype, 'sendTransaction').mockResolvedValue('fakereceipt');

      const result = await chain.sendTransaction(walletTransferData);

      expect(result).toBe('fakereceipt');
    });
  });
});
