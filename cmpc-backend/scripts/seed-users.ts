import { Sequelize } from 'sequelize';
import * as bcrypt from 'bcrypt';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cmpc_books',
  logging: false,
});

async function seedUsers() {
  await sequelize.authenticate();

  console.log('Conectado a PostgreSQL');

  const hashedPassword = await bcrypt.hash('test123', 10);

  await sequelize.query(
    `INSERT INTO users (id, email, password, "createdAt", "updatedAt") 
     VALUES (?, ?, ?, ?, ?) 
     ON CONFLICT (email) DO NOTHING`,
    {
      replacements: [
        crypto.randomUUID(),
        'test@cmpc.com',
        hashedPassword,
        new Date(),
        new Date(),
      ],
    },
  );

  console.log('Usuario de prueba creado: test@cmpc.com / test123');

  await sequelize.close();
}

seedUsers().catch(console.error);
