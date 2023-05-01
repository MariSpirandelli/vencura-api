import credentialController from '../../src/core/credential';
import IExternalCredential from '../../src/domain/models/interfaces/iExternalCredential';
import { Credential } from '../../src/types/authRequest';
import credentialRepo from '../../src/domain/repositories/credentialRepository';
import { ExternalCredentialInput } from '../../src/domain/models/externalCredential';

describe('Credential core', () => {
    const createdAt = Date.now().toString();
    const userId = 1;
    const credential: Credential = {
      userId: 'fakeexternaluserid',
      publicIdentifier: 'fakepublicidentifier',
      format: 'email',
      email: 'test@test.com',
    };
    const expectedParsedData: ExternalCredentialInput = {
      userId,
      externalUserId: credential.userId,
      format: credential.format,
      value: credential.publicIdentifier,
      chain: credential.chain,
    };
    const expectedResultData: IExternalCredential = {
      id: 1,
      createdAt,
      userId,
      externalUserId: credential.userId,
      format: credential.format,
      value: credential.publicIdentifier,
      chain: credential.chain,
      origin: 'DYNAMIC'
    };

  describe('When creating credentials', () => {
    it('should parse right the data before saving', async () => {
      const repoSpy = jest.spyOn(credentialRepo, 'persist').mockImplementation((_: ExternalCredentialInput[]) => Promise.resolve([expectedResultData]));
      const result = await credentialController.create(userId, [credential]);

      expect(repoSpy).toBeCalledWith([expectedParsedData]);
      expect(result).toEqual([expectedResultData])
    });
  });
  describe('When updating credentials', () => {
    it('should parse right the data before saving', async () => {
      const repoSpy = jest.spyOn(credentialRepo, 'update').mockImplementation((_: string, __: ExternalCredentialInput) => Promise.resolve(expectedResultData));
      const result = await credentialController.update(userId, credential);

      expect(repoSpy).toBeCalledWith(credential.userId, expectedParsedData);
      expect(result).toEqual(expectedResultData)
    });
  });
});
