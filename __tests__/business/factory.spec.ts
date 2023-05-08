import Ether from '../../src/business/chains/ether';
import ChainFactory from '../../src/business/factories/chainFactory';
import Wallet from '../../src/business/wallet';

describe('Wallet factory', () => {
  describe('When building wallet based on a specific chain', () => {
    it('should return the right chain if exists', async () => {
      const wallet = ChainFactory.getChainByType('ETHER');

      expect(wallet).toBeInstanceOf(Wallet);
      expect(wallet.chain).toBeInstanceOf(Ether);
    });

    it('should throw exception if not exists', async () => {
      try {
        ChainFactory.getChainByType('HEDERA' as any);
      } catch (error: any) {
        expect(error.message).toEqual('Chain not supported');
      }
    });
  });
});
