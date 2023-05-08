import crypto from '../../src/helpers/cryptography';
import { IUser } from '../../src/domain/models/interfaces/iUser';
import { IUserWallet } from '../../src/domain/models/interfaces/iUserWallet';
import { User } from '../../src/domain/models/user';
import { UserWallet, UserWalletInput } from '../../src/domain/models/userWallet';
import userRepository from '../../src/domain/repositories/userRepository';
import userWalletRepository from '../../src/domain/repositories/userWalletRepository';

describe('User wallet repository', () => {
  let savedUser: IUser;
  beforeAll(async () => {
    const knex = (global as any).__KNEX__;
    User.knex(knex);
    UserWallet.knex(knex);
    await UserWallet.query().delete();
    await User.query().delete();
    
    savedUser = await userRepository.persist({ email: 'test@test.com', name: 'testName' });
  });
  afterAll(async () => {
    await UserWallet.query().delete();
    await User.query().delete();
  });

  describe('When saving user wallets', () => {
    it('should throw exception if mandatory info is not provided', async () => {
      await expect(userWalletRepository.persist({} as any)).rejects.toThrowError();
    });

    it('should return userWallet info after saving', async () => {
      const mokedUserWallet: UserWalletInput = {
        address: 'fakeAddress',
        userId: savedUser.id,
        privateKey: 'fakePrivateKey',
        chain: 'ETHER',
      };
      const userWallet = await userWalletRepository.persist(mokedUserWallet);

      expect(userWallet.id).not.toBeNull();
      expect(userWallet.userId).toEqual(savedUser.id);
      expect(userWallet.address).toEqual(mokedUserWallet.address);
    });
  });
  describe('When doing other operatins', () => {
    let savedUserWallet: IUserWallet;
    let secondSavedUser: IUser;
    const address = 'fakeSecondAddress';
    let mokedUserWallet: UserWalletInput;
    beforeAll(async () => {
      secondSavedUser = await userRepository.persist({ email: 'test_2@test.com', name: 'testName_2' });
      mokedUserWallet = {
        address,
        userId: secondSavedUser.id,
        privateKey: 'fakeSecondPrivateKey',
        chain: 'ETHER',
      };
      savedUserWallet = await userWalletRepository.persist(mokedUserWallet);
    });
    describe('fetch', () => {
      it('it should return all user wallet info', async () => {
        const fetchedUserWallet = await userWalletRepository.fetch(savedUserWallet.id);

        expect(fetchedUserWallet?.id).toEqual(savedUserWallet.id);
        expect(fetchedUserWallet?.address).toEqual(savedUserWallet.address);
        expect(fetchedUserWallet?.privateKey).toEqual(crypto.decrypt(savedUserWallet.privateKey));
      });
      it('it should return all default user wallet info even if there are multiple wallets', async () => {
        const newMokedUserWallet: UserWalletInput = {
          address: 'otherFakeAddress',
          userId: secondSavedUser.id,
          privateKey: 'otherFakeSecondPrivateKey',
          chain: 'ETHER',
        };
        await userWalletRepository.persist(newMokedUserWallet);
        const fetchedUserWallet = await userWalletRepository.fetch(savedUserWallet.id);

        expect(fetchedUserWallet?.id).toEqual(savedUserWallet.id);
        expect(fetchedUserWallet?.address).toEqual(savedUserWallet.address);
        expect(fetchedUserWallet?.privateKey).toEqual(crypto.decrypt(savedUserWallet.privateKey));
      });
    });

    describe('getByUserId', () => {
      it('it should bring all user wallets for the given userId', async () => {
        const newMokedUserWallet: UserWalletInput = {
          address: 'oneOtherFakeAddress',
          userId: secondSavedUser.id,
          privateKey: 'oneOtherFakeSecondPrivateKey',
          chain: 'ETHER',
        };
        await userWalletRepository.persist(newMokedUserWallet);

        const userWallets = await userWalletRepository.getByUserId(secondSavedUser.id);

        expect(userWallets.length).toBeGreaterThan(1);
        expect(userWallets[0].id).toEqual(savedUserWallet.id);
      });
    });
  });
});
