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
    const wallet = ChainFactory.getChainByType('ETHER');
    it('should throw "Not enough balance" error if user does not have enough balance', async () => {
      jest.spyOn(wallet, 'getBalance').mockResolvedValue('0');
      try {
        await wallet.sendTransaction(walletTransferData);
      } catch (error: any) {
        expect(error.message).toBe('Not enough balance');
      }
    });

    it('should throw "Not enough balance" error if user does not have enough balance', async () => {
      jest.spyOn(wallet, 'getBalance').mockResolvedValue('50000000000');
      jest.spyOn(Ether.prototype, 'sendTransaction').mockResolvedValue('fakereceipt');

      const result = await wallet.sendTransaction(walletTransferData);

      expect(result).toBe('fakereceipt');
    });
  });

  describe('When creating wallet', () => {
    it('should call the correspondent chain "create" method', async () => {
      const mokedWallet = { privateKey: 'fakePrivateKey', address: 'fakeaddress' };
      const wallet = ChainFactory.getChainByType('ETHER');
      const createSpy = jest.spyOn(Ether.prototype, 'create').mockImplementation(() => Promise.resolve(mokedWallet));

      const result = await wallet.create();

      expect(createSpy).toBeCalled();
      expect(result).toEqual(mokedWallet);
    });
  });
  describe('When signing message', () => {
    it('should call the correspondent chain "signMessage" method', async () => {
      const mokedParams = { privateKey: 'fakePrivateKey', message: 'fakemessage' };
      const wallet = ChainFactory.getChainByType('ETHER');
      const fakeResultMessage = 'fakeSignedMessageResult';
      const createSpy = jest
        .spyOn(Ether.prototype, 'signMessage')
        .mockImplementation(() => Promise.resolve(fakeResultMessage));

      const result = await wallet.signMessage(mokedParams);

      expect(createSpy).toBeCalled();
      expect(result).toEqual(fakeResultMessage);
    });
  });
  describe('When getting balance', () => {
    it('should call the correspondent chain "getBalance" method', async () => {
      const mokedAddress = 'fakeaddress';
      const mokedBalance = "0";
      const wallet = ChainFactory.getChainByType('ETHER');
      const createSpy = jest.spyOn(Ether.prototype, 'getBalance').mockImplementation(() => Promise.resolve(mokedBalance));

      const result = await wallet.getBalance(mokedAddress);

      expect(createSpy).toBeCalled();
      expect(result).toEqual(mokedBalance);
    });
  });
});
