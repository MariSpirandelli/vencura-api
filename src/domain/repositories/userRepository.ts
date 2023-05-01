import { IUser } from '../models/interfaces/iUser';
import { UserInput, User } from '../models/user';
import { IUserRepository } from './interfaces/iUserRepository';

class UserRepository implements IUserRepository {
  async persist(user: UserInput): Promise<IUser> {
    return User.query().insert(user).returning('*');
  }

  async update(id: number, user: UserInput): Promise<IUser | undefined> {
    return User.query()
      .update({ ...user })
      .where({ id })
      .returning('*')
      .first();
  }

  async fetch(id: number): Promise<IUser | undefined> {
    return User.query().where({ id }).select().first();
  }

  async getByExternalUserId(externalUserIds: string[]): Promise<IUser | undefined> {
    return User.query()
      .leftJoin('external_credentials', 'external_credentials.user_id', 'users.id')
      .whereIn('external_credentials.external_user_id', externalUserIds)
      .first();
  }
}

const userRepository = new UserRepository();
export default userRepository;
