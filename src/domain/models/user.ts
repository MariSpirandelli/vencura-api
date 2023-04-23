import BaseModel from './baseModel';
import { IUser } from './interfaces/iUser';
import { UserWallet } from './userWallet';

export type UserInput = Pick<IUser, 'name' | 'email'>;

export class User extends BaseModel implements IUser{
  name?: string;
  email?: string;

  wallets: UserWallet[] = [];

  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      wallets: {
        join: { from: 'users.id', to: 'user_wallets.user_id' },
        modelClass: UserWallet,
        relation: BaseModel.HasManyRelation,
      },
    };
  }
}
