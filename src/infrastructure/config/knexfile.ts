const knex = {
  client: 'postgresql',
  connection:
    process.env.DATABASE_URL ||
    'postgresql://user:password@db:5432/vencura-dev?schema=public',
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
