import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'postgres',
  logging: false,
});

async function createDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a PostgreSQL');
    await sequelize.query('CREATE DATABASE cmpc_books');
    console.log('✅ Base de datos "cmpc_books" creada exitosamente');
  } catch (error) {
    console.error('Error creando base de datos:', error);

    throw error;
  } finally {
    await sequelize.close();
  }
}

async function createTables() {
  const dbSequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'cmpc_books',
    logging: false,
  });

  try {
    await dbSequelize.authenticate();
    console.log('Conectado a base de datos cmpc_books');

    // Crear tabla users
    await dbSequelize.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
      )
    `);
    console.log('Tabla "users" creada');

    // Crear tabla books
    await dbSequelize.query(`
      CREATE TABLE IF NOT EXISTS books (
        id UUID PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        editorial VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        genero VARCHAR(255) NOT NULL,
        disponibilidad BOOLEAN DEFAULT true,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
        "deletedAt" TIMESTAMP WITH TIME ZONE
      )
    `);
    console.log('Tabla "books" creada');
  } catch (error) {
    console.error('Error creando tablas:', error);
    throw error;
  } finally {
    await dbSequelize.close();
  }
}

async function setup() {
  await createDatabase();
  await createTables();
  console.log('Base de datos y tablas creadas exitosamente');
}

setup().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
