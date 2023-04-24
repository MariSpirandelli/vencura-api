import Objection from 'objection';
import crypto from '../../helpers/cryptography';
import { Chain } from '../../types/chain';
import BaseModel from './baseModel';
import ITransaction from './interfaces/iTransaction';
import { User } from './user';
import { TransactionStatus } from '../../types/transaction';
import { UserWallet } from './userWallet';

export type TransactionInput = Pick<ITransaction, 'fromUserWalletId' | 'toUserWalletId' | 'toWalletAddress' | 'amount'>;

export class Transaction extends BaseModel implements ITransaction {
  fromUserWalletId!: number;
  toUserWalletId?: number;
  toWalletAddress!: string;
  amount!: number;
  status!: TransactionStatus;
  failReason?: string | undefined;

  fromUserWallet?: UserWallet;
  toUserWallet?: UserWallet;

  static get tableName() {
    return 'transactions';
  }

  $beforeInsert() {
    super.$beforeInsert();
    this.status = 'IN_PROCESS';
  }

  static get relationMappings() {
    return {
      fromUserWallet: {
        join: { from: 'transactions.from_user_wallet_id', to: 'user_wallets.id' },
        modelClass: UserWallet,
        relation: BaseModel.HasOneRelation,
      },
      toUserWallet: {
        join: { from: 'transactions.to_user_wallet_id', to: 'user_wallets.id' },
        modelClass: UserWallet,
        relation: BaseModel.HasOneRelation,
      },
    };
  }
}