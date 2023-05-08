import IExternalCredential from '../../models/interfaces/iExternalCredential';
import { ExternalCredential, ExternalCredentialInput } from '../../models/externalCredential';
import { IBaseRepository } from './iBaseRepository';

export interface ICredentialRepository extends IBaseRepository<ExternalCredential> {
  persistMany: (credentials: ExternalCredentialInput[]) => Promise<IExternalCredential[]>;
  updateByExternalUserId: (externalUserId: string, credential: ExternalCredentialInput) => Promise<IExternalCredential | undefined>
  getByExternalCredentialsList: (externalCredentials: string[]) => Promise<IExternalCredential[]>;
  getByExternalCredentialId: (externalCredentialId: string) => Promise<IExternalCredential | undefined>;
}
