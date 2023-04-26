import ITransaction from '../models/interfaces/iTransaction';
import { TransactionInput, Transaction } from '../models/transaction';
import { ITransactionRepository } from './interfaces/iTransactionRepository';

class TransactionRepository implements ITransactionRepository {
  async persist(transaction: TransactionInput): Promise<ITransaction> {
    return await Transaction.query().insert(transaction).returning('*');
  }

  async fetchAll(userId: number): Promise<ITransaction[]> {
    return Transaction.query()
      .leftJoin('user_wallets', 'transactions.from_user_wallet_id', 'user_wallets.id')
      .leftJoin('users', 'users.id', 'user_wallets.user_id')
      .where('users.id', userId)
      .orderBy('created_at', 'DESC');
  }

  async fetch(id: number): Promise<ITransaction | undefined> {
    return Transaction.query().where({ id }).select().first();
  }

  async getByIdempotencyKey(idempotencyKey: string): Promise<ITransaction | undefined> {
    return Transaction.query().where('idempotency_key', idempotencyKey).first();
  }
}

const transactionRepository = new TransactionRepository();
export default transactionRepository;
