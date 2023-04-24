import { createLogger } from 'bunyan';
import { IUser } from '../domain/models/interfaces/iUser';
import { UserInput } from '../domain/models/user';
import { IUserRepository } from '../domain/repositories/interfaces/iUserRepository';
import userRepository from '../domain/repositories/userRepository';
import { InternalError } from '../infrastructure/express/errors';
import IUserController from './interfaces/iUser';
import IWalletController from './interfaces/iWallet';
import walletController from './wallet';
import { AuthInfo } from '../types/authRequest';
import ICredentialController from './interfaces/iCredential';
import credentialController from './credential';
import IExternalCredential from '../domain/models/interfaces/iExternalCredential';

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

  async updateCredentials(userInfo: AuthInfo) : Promise<IExternalCredential[]>{
    const {verifiedCredentials} = userInfo

    const externalCredentialsIds = verifiedCredentials.map((credential) => credential.userId);
    const existentCredentials = await credentialController.getByExternalCredentialsList(externalCredentialsIds);

    if (existentCredentials?.length === verifiedCredentials.length) {
      return [];
    }

    const newCredentials = [];
    verifiedCredentials.map((credential) => {
      const existent = existentCredentials.find(({externalUserId}) => externalUserId === credential.userId);
      if (existent) {
        return
      }

      newCredentials.push(credential);
    });

    return this.credentialControler.create(existentCredentials[0].userId, verifiedCredentials);
  }

  getByExternalUserId(externalUserId: string): Promise<IUser | undefined> {
    return this.userRepository.getByExternalUserId(externalUserId);
  }
}

const userController = new UserController(userRepository, walletController, credentialController);
export default userController;
