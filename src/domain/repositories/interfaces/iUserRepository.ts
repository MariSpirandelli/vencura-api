import { IUser } from '../../models/interfaces/iUser';
import { UserInput } from '../../models/user';

export interface IUserRepository {
  persist: (user: UserInput) => Promise<IUser>;
  update: (userId: number, user: UserInput) => Promise<IUser | undefined>;
  fetch: (id: number) => Promise<IUser | undefined>;
  getByExternalUserId: (externalUserId: string) => Promise<IUser | undefined>;
}
