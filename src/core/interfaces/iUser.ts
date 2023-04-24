import IExternalCredential from '../../domain/models/interfaces/iExternalCredential';
import { IUser } from '../../domain/models/interfaces/iUser';
import { UserInput } from '../../domain/models/user';
import { AuthInfo } from '../../types/authRequest';

export default interface IUserController {
  create: (userInfo: AuthInfo) => Promise<IUser>;
  updateCredentials: (userInfo: AuthInfo) => Promise<IExternalCredential[]>;
  update: (userId: number, userInfo: UserInput) => Promise<IUser | undefined>;
  getByExternalUserId: (externalUserId: string) => Promise<IUser | undefined>;
}
