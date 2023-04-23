import { ExternalCredentialInput } from '../domain/models/externalCredential';
import IExternalCredential from '../domain/models/interfaces/iExternalCredential';
import credentialRepository from '../domain/repositories/credentialRepository';
import { ICredentialRepository } from '../domain/repositories/interfaces/iCredentialRepository';
import { Credential } from '../types/authRequest';
import ICredentialController from './interfaces/iCredential';

class CredentialController implements ICredentialController {
  constructor(private credentialRepo: ICredentialRepository) {}

  create(userId: number, externalCredentials: Credential[]): Promise<IExternalCredential[]> {
    const credentials: ExternalCredentialInput[] = [];
    externalCredentials.map((credential) => {
      credentials.push({
        userId,
        externalUserId: credential.userId,
        format: credential.format,
        value: credential.publicIdentifier,
        chain: credential.chain,
      });
    });

    return this.credentialRepo.persist(credentials);
  }

  update(userId: number, credential: Credential): Promise<IExternalCredential | undefined> {
    const externalCredential: ExternalCredentialInput = {
      userId,
      externalUserId: credential.userId,
      format: credential.format,
      value: credential.publicIdentifier,
      chain: credential.chain,
    };

    return this.credentialRepo.update(credential.userId, externalCredential);
  }

  getByExternalUserId(externalUserId: string): Promise<IExternalCredential | undefined> {
    return this.credentialRepo.getByExternalCredentialId(externalUserId);
  }
}

const credentialController = new CredentialController(credentialRepository);
export default credentialController;
