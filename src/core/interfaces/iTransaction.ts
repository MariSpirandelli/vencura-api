import ITransaction from '../../domain/models/interfaces/iTransaction';
import { TransactionInput } from '../../domain/models/transaction';

export default interface ITransactionController {
  request: (transactionInfo: TransactionInput) => Promise<ITransaction>;
  fetchAll: (userId: number) => Promise<ITransaction[]>;
}
