import { CredentialFormat } from '../../types/authRequest';
import BaseModel from './baseModel';
import IExternalCredential from './interfaces/iExternalCredential';
import { User } from './user';

export type ExternalCredentialInput = Pick<ExternalCredential, 'userId' | 'externalUserId' | 'format' | 'value' | 'chain'>;

export class ExternalCredential extends BaseModel implements IExternalCredential {
  userId!: number;
  externalUserId!: string;
  format!: CredentialFormat;
  value!: string;
  chain?: string;
  origin!: 'Dynamic';

  user?: User;

  static get tableName() {
    return 'external_credentials';
  }

  static get relationMappings() {
    return {
      wallets: {
        join: { from: 'users.id', to: 'external_credentials.user_id' },
        modelClass: User,
        relation: BaseModel.HasOneRelation,
      },
    };
  }
}
