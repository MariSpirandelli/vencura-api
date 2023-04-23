import IExternalCredential from "../../domain/models/interfaces/iExternalCredential";
import { Credential } from "../../types/authRequest";

export default interface ICredentialController {
  create: (userId: number, credentials: Credential[]) => Promise<IExternalCredential[]>;
  update: (userId: number, credential: Credential) => Promise<IExternalCredential | undefined>;
  getByExternalUserId: (externalUserId: string) => Promise<IExternalCredential | undefined>;
}
