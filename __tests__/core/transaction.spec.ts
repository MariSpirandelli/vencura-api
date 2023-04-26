import transactionController from '../../src/core/transaction';
import walletController from '../../src/core/wallet';
import transactionRepository from '../../src/domain/repositories/transactionRepository';

describe('Transaction core', () => {
  describe('When all data provided is correct', () => {
    it('should should call walletController.sendTransaction with the correct input info', async () => {
      const mokedTransaction = (async () => undefined)();
      const mokedWallet = { id: 1, address: 'fakeaddress', privateKey: 'fakeprivatekey' } as any;
      const mokedReceipt = 'fakereceipt';
      const mokedReceiptPromise = (async () => mokedReceipt)();

      jest.spyOn(transactionRepository, 'getByIdempotencyKey').mockReturnValue(mokedTransaction);
      jest.spyOn(walletController, 'getById').mockReturnValue(mokedWallet);
      const repoSpy = jest.spyOn(transactionRepository, 'persist').mockReturnValue(
        (async () => {
          return {} as any;
        })(),
      );
      const controllerSpy = jest.spyOn(walletController, 'sendTransaction').mockReturnValue(mokedReceiptPromise);
      const transactionInfo = {
        idempotencyKey: 'fakeidempotency',
        fromUserWalletId: 1,
        toWalletAddress: 'fakewalletaddress',
        amount: '0.00001',
      };

      await transactionController.request(transactionInfo);

      expect(controllerSpy).toBeCalledWith({
        fromAddress: 'fakeaddress',
        fromPrivateKey: 'fakeprivatekey',
        toAddress: 'fakewalletaddress',
        amount: '0.00001',
      });

      expect(repoSpy).toBeCalledWith({
        idempotencyKey: 'fakeidempotency',
        fromUserWalletId: 1,
        toWalletAddress: 'fakewalletaddress',
        amount: '0.00001',
        receipt: 'fakereceipt',
        status: 'COMPLETE',
      });
    });
  });
});
