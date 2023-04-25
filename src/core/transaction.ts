import bunyan from 'bunyan';
import ITransaction from '../domain/models/interfaces/iTransaction';
import { TransactionInput } from '../domain/models/transaction';
import { ITransactionRepository } from '../domain/repositories/interfaces/iTransactionRepository';
import { BadRequestError } from '../infrastructure/express/errors';
import { TransactionStatus } from '../types/transaction';
import { WalletTransferData } from '../types/wallet';
import ITransactionController from './interfaces/iTransaction';
import IWalletController from './interfaces/iWallet';
import walletController from './wallet';
import transactionRepository from '../domain/repositories/transactionRepository';

const logger = bunyan.createLogger({ name: 'core:: transaction' });

class TransactionController implements ITransactionController {
  constructor(private transactionRepo: ITransactionRepository, private walletController: IWalletController) {}

  async request(transactionInfo: TransactionInput): Promise<ITransaction> {
    await this.validateTransferRequest(transactionInfo);

    const walletTransferData = await this.getWalletTransferData(transactionInfo);

    let receipt: string | undefined;
    let status: TransactionStatus;
    let failReason: string | undefined;
    try {
      receipt = await this.walletController.sendTransaction(walletTransferData);
      status = 'COMPLETE';
    } catch (error: any) {
      status = 'FAILED';
      failReason = error?.info?.error?.message || error?.message;

      logger.error(`[request] Error while executing transaction`, error);
    }
    const { idempotencyKey, fromUserWalletId, amount, toUserWalletId } = transactionInfo;

    return this.transactionRepo.persist({
      idempotencyKey,
      fromUserWalletId,
      amount,
      receipt,
      toWalletAddress: walletTransferData.toAddress,
      toUserWalletId,
      status,
      failReason,
    });
  }
  private async validateTransferRequest(transactionInfo: TransactionInput) {
    if (!transactionInfo?.fromUserWalletId) {
      throw new BadRequestError('Wallet info is mandatory');
    }

    const existingTransaction = await this.transactionRepo.getByIdempotencyKey(transactionInfo.idempotencyKey);

    if (existingTransaction) {
      throw new BadRequestError('Transaction already in progress.');
    }
  }

  private async getWalletTransferData(transactionInfo: TransactionInput) {
    const promises = [this.walletController.getById(transactionInfo.fromUserWalletId)];

    if (transactionInfo.toUserWalletId) {
      promises.push(this.walletController.getById(transactionInfo.toUserWalletId));
    }

    const [fromUserWallet, toUserWallet] = await Promise.all(promises);
    if (!fromUserWallet || (!transactionInfo.toWalletAddress && !toUserWallet)) {
      throw new BadRequestError('Wallet info is mandatory');
    }

    const walletTransferData: WalletTransferData = {
      fromAddress: fromUserWallet.address,
      fromPrivateKey: fromUserWallet.privateKey,
      toAddress: toUserWallet?.address || transactionInfo.toWalletAddress,
      amount: transactionInfo.amount,
    };

    return walletTransferData;
  }

  fetchAll(userId: number): Promise<ITransaction[]> {
    return this.transactionRepo.fetchAll(userId);
  }
}

const transactionController = new TransactionController(transactionRepository, walletController);
export default transactionController;
