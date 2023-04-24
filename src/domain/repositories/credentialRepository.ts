import IExternalCredential from '../models/interfaces/iExternalCredential';
import { ExternalCredentialInput, ExternalCredential } from '../models/externalCredential';
import { ICredentialRepository } from './interfaces/iCredentialRepository';

class CredentialRepository implements ICredentialRepository {
  async persist(credentials: ExternalCredentialInput[]): Promise<IExternalCredential[]> {
    return ExternalCredential.query().insert(credentials).returning('*');
  }

  async update(externalUserId: string, credential: ExternalCredentialInput): Promise<IExternalCredential | undefined> {
    return ExternalCredential.query()
      .update({ ...credential })
      .where('external_user_id', externalUserId)
      .returning('*')
      .first();
  }

  async fetch(id: number): Promise<IExternalCredential | undefined> {
    return ExternalCredential.query().where({ id }).select().first();
  }

  async getByExternalCredentialsList(externalCredentials: string[]): Promise<IExternalCredential[]> {
    return ExternalCredential.query().whereIn('external_user_id', externalCredentials);
  }

  async getByExternalCredentialId(externalCredentialId: string): Promise<IExternalCredential | undefined> {
    return ExternalCredential.query().where('external_user_id', externalCredentialId).first();
  }
}

const credentialRepository = new CredentialRepository();
export default credentialRepository;
