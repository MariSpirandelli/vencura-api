import ITransaction from '../../models/interfaces/iTransaction';
import { TransactionInput } from '../../models/transaction';

export interface ITransactionRepository {
  persist: (userWallet: TransactionInput) => Promise<ITransaction>;
  fetchAll: (userId: number) => Promise<ITransaction[]>;
  fetch: (id: number) => Promise<ITransaction | undefined>;
  getByIdempotencyKey: (idempotencyKey: string) => Promise<ITransaction | undefined>;
}