import { ExternalCredential } from '../../src/domain/models/externalCredential';
import { IUser } from '../../src/domain/models/interfaces/iUser';
import { User } from '../../src/domain/models/user';
import userRepository from '../../src/domain/repositories/userRepository';

describe('User repository', () => {
  beforeAll(() => {
    const knex = (global as any).__KNEX__;
    User.knex(knex);
    ExternalCredential.knex(knex);
  });
  afterAll(async () => {
    await ExternalCredential.query().delete();
    await User.query().delete();
  });

  describe('When saving users', () => {
    it('should be saved even if no email or name is provided', async () => {
      const user = await userRepository.persist({});

      expect(user.id).not.toBeNull();
    });
  });
  describe('When doing other operations', () => {
    let savedUser: IUser;
    const name = 'testName';
    beforeAll(async () => {
      savedUser = await userRepository.persist({ email: 'test@test.com' });
    });
    describe('update', () => {
      it('it should be corrected updated and return all user info', async () => {
        const updatedUser = await userRepository.update(savedUser.id, { name });

        expect(updatedUser?.id).toEqual(savedUser.id);
        expect(updatedUser?.name).toEqual(name);
        expect(updatedUser?.email).toEqual(savedUser.email);
      });
    });

    describe('fetch', () => {
      it('it should bring the correct data', async () => {
        const fetchedUser = await userRepository.fetch(savedUser.id);

        expect(fetchedUser?.name).toEqual(name);
      });
    });
    describe('getByExternalUserId', () => {
      it('it should bring the correct data', async () => {
        const externalUserId = 'fakeExternalId';
        const value = 'fakeValue';
        const externalCredential = await ExternalCredential.query()
          .insert({
            userId: savedUser.id,
            value,
            format: 'blockchain',
            externalUserId,
            origin: 'DYNAMIC',
          })
          .returning('*');

        expect(externalCredential?.id).not.toBeNull();

        const fetchedUser = await userRepository.getByExternalUserId([externalUserId]);

        expect(fetchedUser?.id).toEqual(savedUser.id);
        expect(fetchedUser?.email).toEqual(savedUser.email);
      });
    });
  });
});
