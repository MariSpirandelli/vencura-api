import userRepository from '../../src/domain/repositories/userRepository';
import userWalletController from '../../src/core/wallet';
import credentialControler from '../../src/core/credential';
import userController from '../../src/core/user';
import { AuthInfo, Credential } from '../../src/types/authRequest';
import credentialController from '../../src/core/credential';
import IExternalCredential from '../../src/domain/models/interfaces/iExternalCredential';

describe('User core', () => {
  const createdAt = Date.now().toString();
  const credential: Credential = {
    userId: 'fakeexternaluserid',
    publicIdentifier: 'fakepublicidentifier',
    format: 'email',
    email: 'test@test.com',
  };
  const authInfo: AuthInfo = {
    verifiedCredentials: [credential],
    email: 'test@test.com',
    environmentId: 'fakeenvironmentId',
    isNewUser: true,
  };
  const savedCredential: IExternalCredential = {
    id: 1,
    userId: 1,
    externalUserId: credential.userId,
    format: credential.format,
    value: credential.publicIdentifier,
    origin: 'DYNAMIC',
    createdAt,
  };
  describe('When creating user', () => {
    it('it should save user, update external credentials and create and save a new vencura wallet', async () => {
      const mokedUser = { id: 1, createdAt };
      jest.spyOn(userRepository, 'persist').mockResolvedValue(mokedUser);
      const credentialSpy = jest.spyOn(credentialControler, 'create').mockResolvedValue([savedCredential]);
      const userWalletSpy = jest.spyOn(userWalletController, 'create').mockResolvedValue('fakeuserwalletaddress');

      const newUser = await userController.create(authInfo);

      expect(credentialSpy).toBeCalledWith(1, authInfo.verifiedCredentials);
      expect(userWalletSpy).toBeCalledWith(1);
      expect(newUser).toBe(mokedUser);
    });
  });

  describe('When updating user credentials', () => {
    describe('When there is no new credentials', () => {
      it('Should not create new ones', async () => {
        jest.spyOn(credentialController, 'getByExternalCredentialsList').mockResolvedValue([savedCredential]);
        const credentialSpy = jest.spyOn(credentialController, 'create');

        await userController.updateCredentials(authInfo);
        expect(credentialSpy).not.toBeCalled();
      });
    });

    describe('When there is new credentials', () => {
      it('Should create new ones', async () => {
        const newAuthInfo = { ...authInfo };
        const newCredential: Credential = {
          userId: 'fakeexternaluserid_2',
          publicIdentifier: 'fakepublicidentifier_2',
          format: 'email',
          email: 'test_2@test.com',
        };
        newAuthInfo.verifiedCredentials.push(newCredential);
        jest.spyOn(credentialController, 'getByExternalCredentialsList').mockResolvedValue([savedCredential]);
        const credentialSpy = jest.spyOn(credentialController, 'create');

        await userController.updateCredentials(authInfo);
        expect(credentialSpy).toBeCalledWith(1, [newCredential]);
      });
    });
  });
});
