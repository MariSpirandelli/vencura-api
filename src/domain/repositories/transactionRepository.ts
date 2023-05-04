import ITransaction from '../models/interfaces/iTransaction';
import { Transaction } from '../models/transaction';
import BaseRepository from './baseRepository';
import { ITransactionRepository } from './interfaces/iTransactionRepository';

class TransactionRepository extends BaseRepository<Transaction> implements ITransactionRepository {
  async fetchAll(userId: number): Promise<ITransaction[]> {
    return Transaction.query()
      .leftJoin('user_wallets', 'transactions.from_user_wallet_id', 'user_wallets.id')
      .leftJoin('users', 'users.id', 'user_wallets.user_id')
      .where('users.id', userId)
      .orderBy('created_at', 'DESC');
  }

  async getByIdempotencyKey(idempotencyKey: string): Promise<ITransaction | undefined> {
    return Transaction.query().where('idempotency_key', idempotencyKey).first();
  }
}

const transactionRepository = new TransactionRepository(Transaction);
export default transactionRepository;
