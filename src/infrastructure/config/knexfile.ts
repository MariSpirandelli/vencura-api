let connection;
if (process.env.NODE_ENV === 'development') {
  connection =
    process.env.DATABASE_URL ||
    'postgresql://user:password@db:5432/vencura-dev?schema=public';
} else {
  connection = {
    connectionString:
      process.env.DATABASE_URL ||
      'postgresql://user:password@db:5432/vencura-dev?schema=public',
    ssl: { rejectUnauthorized: false },
  };
}

const knex = {
  client: 'postgresql',
  connection,
  migrations: {
    tableName: 'knex_migrations',
    directory: `${__dirname}/../orm/objection/migrations`,
  },
  seeds: {
    run: Boolean(process.env.SEED_ON_DEPLOY),
    directory: `${__dirname}/../orm/objection/seeds`,
  },
  pool: {
    min: +(process.env.MIN_CONNECTION_POOL || 4),
    max: +(process.env.MAX_CONNECTION_POOL || 30),
  },
};

export default knex;
