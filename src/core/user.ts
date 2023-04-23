import { createLogger } from 'bunyan';
import { IUser } from '../domain/models/interfaces/iUser';
import { UserInput } from '../domain/models/user';
import { IUserRepository } from '../domain/repositories/interfaces/iUserRepository';
import userRepository from '../domain/repositories/user';
import { InternalError } from '../infrastructure/express/errors';
import IUserController from './interfaces/iUser';
import IWalletController from './interfaces/iWallet';
import walletController from './wallet';
import { AuthInfo } from '../types/authRequest';
import ICredentialController from './interfaces/iCredential';
import credentialController from './credential';

const logger = createLogger({ name: 'core::user' });

class UserController implements IUserController {
  constructor(private userRepository: IUserRepository, private userWalletController: IWalletController, private credentialControler: ICredentialController) {}
  async create(userInfo: AuthInfo): Promise<IUser> {
    try {
      const { verifiedCredentials, email } = userInfo;

      const newUser = await this.userRepository.persist({ email });

      if (!newUser) {
        throw new InternalError('An error occurred while processing your Request. Try again later');
      }

      await this.credentialControler.create(newUser.id, verifiedCredentials);
      
      await this.userWalletController.create(newUser.id);

      return newUser;
    } catch (error) {
      logger.error(`[create] Error while creating user:`, error);

      throw new InternalError('An error occurred while processing your Request. Try again later');
    }
  }

  update(userId: number, userInfo: UserInput): Promise<IUser | undefined> {
    return this.userRepository.update(userId, userInfo);
  }

  getByExternalUserId(externalUserId: string): Promise<IUser | undefined> {
    return this.userRepository.fetch(parseInt(externalUserId, 10));
  }
}

const userController = new UserController(userRepository, walletController, credentialController);
export default userController;
