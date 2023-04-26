import transactionController from '../../src/core/transaction';
import walletController from '../../src/core/wallet';
import transactionRepository from '../../src/domain/repositories/transactionRepository';
import { WalletTransferData } from '../../src/types/wallet';

describe('Transaction Core validation', () => {
  describe('When requesting a new transaction it should validate transaction info', () => {
    describe('When missing data like', () => {
      it('fromUserWalletId should throw "Wallet info is mandatory" error', async () => {
        try {
          const transactionInfo = {
            idempotencyKey: '',
            // fromUserWalletId: number,
            toWalletAddress: '',
            amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Wallet info is mandatory');
        }
      });
      it('toWalletAddress should throw "Wallet info is mandatory" error', async () => {
        try {
          const transactionInfo = {
            idempotencyKey: '',
            fromUserWalletId: 1,
            // toWalletAddress: '',
            amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Wallet info is mandatory');
        }
      });
      it('idempotencyKey should throw "Idempotency key is mandatory" error', async () => {
        try {
          const transactionInfo = {
            // idempotencyKey: '',
            fromUserWalletId: 1,
            toWalletAddress: 'fakewalletaddress',
            amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Idempotency key is mandatory');
        }
      });
      it('amount should throw "Amount is mandatory" error', async () => {
        try {
          const transactionInfo = {
            idempotencyKey: 'fakeidempotency',
            fromUserWalletId: 1,
            toWalletAddress: 'fakewalletaddress',
            // amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Amount is mandatory');
        }
      });
    });

    describe('When duplicated idempotency key', () => {
      it('should should throw "Transaction already in progress." error', async () => {
        const mokedTransaction = { id: 1 } as any;
        jest.spyOn(transactionRepository, 'getByIdempotencyKey').mockReturnValue(mokedTransaction);
        try {
          const transactionInfo = {
            idempotencyKey: 'fakeidempotency',
            fromUserWalletId: 1,
            toWalletAddress: 'fakeWalletAddress',
            amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Transaction already in progress.');
        }
      });
    });

    describe('When provided fromUserWalletId is not found', () => {
      it('should should throw "Wallet info is mandatory" error', async () => {
        const mokedTransaction = { id: 1 } as any;
        const mokedWallet = (async () => undefined)();
        jest.spyOn(transactionRepository, 'getByIdempotencyKey').mockReturnValue(mokedTransaction);
        jest.spyOn(walletController, 'getById').mockReturnValue(mokedWallet);
        try {
          const transactionInfo = {
            idempotencyKey: 'fakeidempotency',
            fromUserWalletId: 1,
            toWalletAddress: '',
            amount: '0.00001',
          };
          await transactionController.request(transactionInfo as any);
        } catch (error: any) {
          expect(error.message).toEqual('Wallet info is mandatory');
        }
      });
    });
  });
});
