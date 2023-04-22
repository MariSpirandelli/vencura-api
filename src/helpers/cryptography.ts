import crypto from 'crypto';
import config from '../infrastructure/config';

const algorithm = 'aes-256-cbc';

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(config.apiSecret.key),
    config.apiSecret.initVector.slice(0, 16),
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted.toString('hex');
};

const decrypt = (text: string) => {
  const encryptedText = Buffer.from(text, 'hex');
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(config.apiSecret.key),
    config.apiSecret.initVector.slice(0, 16),
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export default {
  encrypt,
  decrypt,
};
