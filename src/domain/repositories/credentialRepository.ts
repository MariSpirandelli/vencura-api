import IExternalCredential from '../models/interfaces/iExternalCredential';
import { ExternalCredentialInput, ExternalCredential } from '../models/externalCredential';
import { ICredentialRepository } from './interfaces/iCredentialRepository';
import BaseRepository from './baseRepository';

class CredentialRepository extends BaseRepository<ExternalCredential> implements ICredentialRepository {
  async persistMany(credentials: ExternalCredentialInput[]): Promise<IExternalCredential[]> {
    return ExternalCredential.query().insert(credentials).returning('*');
  }

  async updateByExternalUserId(
    externalUserId: string,
    credential: ExternalCredentialInput,
  ): Promise<IExternalCredential | undefined> {
    return ExternalCredential.query()
      .update({ ...credential })
      .where('external_user_id', externalUserId)
      .returning('*')
      .first();
  }

  async getByExternalCredentialsList(externalCredentials: string[]): Promise<IExternalCredential[]> {
    return ExternalCredential.query().whereIn('external_user_id', externalCredentials);
  }

  async getByExternalCredentialId(externalCredentialId: string): Promise<IExternalCredential | undefined> {
    return ExternalCredential.query().where('external_user_id', externalCredentialId).first();
  }
}

const credentialRepository = new CredentialRepository(ExternalCredential);
export default credentialRepository;
