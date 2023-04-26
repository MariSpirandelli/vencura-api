import crypto from '../../src/helpers/cryptography';

describe('Helpers cryptography', () => {
  describe('after decrypting a message', () => {
    it('it should return the same from before encrypting', async () => {
      const message = 'hello world';
      const encryptedMessage = crypto.encrypt(message);
      const decryptedMessage = crypto.decrypt(encryptedMessage);

      expect(decryptedMessage).toEqual(message);
    });
  });
});
