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
      credentials.push(this.parseCredential(userId, credential));
    });

    return this.credentialRepo.persistMany(credentials);
  }

  update(userId: number, credential: Credential): Promise<IExternalCredential | undefined> {
    return this.credentialRepo.updateByExternalUserId(credential.userId, this.parseCredential(userId, credential));
  }

  getByExternalCredentialsList(externalCredentials: string[]): Promise<IExternalCredential[]> {
    return this.credentialRepo.getByExternalCredentialsList(externalCredentials);
  }

  getByExternalUserId(externalUserId: string): Promise<IExternalCredential | undefined> {
    return this.credentialRepo.getByExternalCredentialId(externalUserId);
  }

  private parseCredential(userId: number, credential: Credential): ExternalCredentialInput {
    return {
      userId,
      externalUserId: credential.userId,
      format: credential.format,
      value: credential.publicIdentifier,
      chain: credential.chain,
    };
  }
}

const credentialController = new CredentialController(credentialRepository);
export default credentialController;
