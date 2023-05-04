import { IUser } from '../../models/interfaces/iUser';
import { User } from '../../models/user';
import { IBaseRepository } from './iBaseRepository';

export interface IUserRepository extends IBaseRepository<User> {
  getByExternalUserId: (externalUserIds: string[]) => Promise<IUser | undefined>;
}
