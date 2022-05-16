module.exports = ({ env }) => ({
  defaultConnection: 'default',
  connections: {
    default: {
      connector: 'bookshelf',
      settings: {
        client: 'postgres',
        host: env('DATABASE_HOST', 'postgres'),
        port: env.int('DATABASE_PORT', 5432),
        database: env('DATABASE_NAME', 'habrdb'),
        username: env('DATABASE_USERNAME', 'habrpguser'),
        password: env('DATABASE_PASSWORD', 'pgpwd4habr'),
        ssl: env.bool('DATABASE_SSL', false),
      },
      options: {}
    },
  },
});
