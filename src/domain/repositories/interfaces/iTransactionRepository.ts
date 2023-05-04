import ITransaction from '../../models/interfaces/iTransaction';
import { Transaction, TransactionInput } from '../../models/transaction';
import { IBaseRepository } from './iBaseRepository';

export interface ITransactionRepository extends IBaseRepository<Transaction> {
  fetchAll: (userId: number) => Promise<ITransaction[]>;
  getByIdempotencyKey: (idempotencyKey: string) => Promise<ITransaction | undefined>;
}