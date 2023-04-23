import Objection from 'objection';
import crypto from '../../helpers/cryptography';
import { Chain } from '../../types/chain';
import BaseModel from './baseModel';
import { IUserWallet } from './interfaces/iUserWallet';
import { User } from './user';

export type UserWalletInput = Pick<IUserWallet, 'address' | 'privateKey' | 'chain' | 'userId'>;

export class UserWallet extends BaseModel implements IUserWallet {
  userId!: number;
  privateKey!: string;
  chain!: Chain;
  address!: string;

  user?: User;

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.privateKey = crypto.encrypt(this.privateKey);
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
    if (this.privateKey) {
      this.privateKey = crypto.encrypt(this.privateKey);
    }
  }

  $afterFind(context: Objection.QueryContext) {
    super.$afterFind(context);
    let decrypted;
    try {
      decrypted = crypto.decrypt(this.privateKey);
      this.privateKey = decrypted;
    } catch {
      return; // case it's not yet encrypted, it throws an error (might be able to remove after migrations)
    }
  }

  static get tableName() {
    return 'user_wallets';
  }

  static get relationMappings() {
    return {
      user: {
        join: { from: 'user_wallets.user_id', to: 'users.id' },
        modelClass: User,
        relation: BaseModel.HasOneRelation,
      },
    };
  }
}
