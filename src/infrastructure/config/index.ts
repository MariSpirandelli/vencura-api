import dotenv from 'dotenv';
import knex from './knexfile';

dotenv.config();
dotenv.config({ path: `${__dirname}/../../${process.env.NODE_ENV}.env` });

const env = process.env.NODE_ENV || 'development';
const port = +(process.env.PORT || 3000);

const apiSecret = {
  key: process.env.API_SECRET_KEY || 'frIBy8JQj9JSi1lYrSW3tlUWoIoKCuHn',
  initVector: process.env.API_SECRET_INIT_VECTOR || '9f5f5b43440af18b042d00f055a5a4a0',
};

const dynamic = {
  publicToken: process.env.DYNAMIC_PUBLIC_TOKEN || '',
  environmentId: process.env.DYNAMIC_ENVIRONMENT_ID || '',
};

const infuraProvider = {
  apiSecret: process.env.INFURA_API_SECRET,
  apiKey: process.env.INFURA_API_KEY,
  goerli: process.env.INFURA_GOERLI
}

export default {
  apiSecret,
  dynamic,
  env,
  infuraProvider,
  knex,
  port,
};
