import IExternalCredential from '../../models/interfaces/iExternalCredential';
import { ExternalCredentialInput } from '../../models/externalCredential';

export interface ICredentialRepository {
  persist: (credential: ExternalCredentialInput[]) => Promise<IExternalCredential[]>;
  update: (
    externalCredentialId: string,
    credential: ExternalCredentialInput,
  ) => Promise<IExternalCredential | undefined>;
  fetch: (externalCredentialId: number) => Promise<IExternalCredential | undefined>;
  getByExternalCredentialsList: (externalCredentials: string[]) => Promise<IExternalCredential[]>;
  getByExternalCredentialId: (externalCredentialId: string) => Promise<IExternalCredential | undefined>;
}
