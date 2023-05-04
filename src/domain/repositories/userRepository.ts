import { IUser } from '../models/interfaces/iUser';
import { UserInput, User } from '../models/user';
import BaseRepository from './baseRepository';
import { IUserRepository } from './interfaces/iUserRepository';

class UserRepository extends BaseRepository<User> implements IUserRepository {
  async getByExternalUserId(externalUserIds: string[]): Promise<IUser | undefined> {
    return User.query()
      .leftJoin('external_credentials', 'external_credentials.user_id', 'users.id')
      .whereIn('external_credentials.external_user_id', externalUserIds)
      .first();
  }
}

const userRepository = new UserRepository(User);
export default userRepository;
