import { Sequelize } from 'sequelize';
import { faker } from '@faker-js/faker';

interface Book {
  id: string;
  titulo: string;
  autor: string;
  editorial: string;
  precio: number;
  disponibilidad: boolean;
  genero: string;
  createdAt: Date;
  updatedAt: Date;
}

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'cmpc_books',
  logging: false,
});

async function seed() {
  await sequelize.authenticate();
  console.log('Conectado a PostgreSQL');

  const books: Book[] = [];
  for (let i = 1; i <= 1000; i++) {
    books.push({
      id: crypto.randomUUID(),
      titulo: faker.book.title(),
      autor: faker.book.author(),
      editorial: faker.book.publisher(),
      precio: faker.number.int({ min: 5000, max: 35000 }),
      disponibilidad: faker.datatype.boolean(0.8),
      genero: faker.book.genre(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  await sequelize.query('TRUNCATE TABLE books RESTART IDENTITY CASCADE');

  const chunkSize = 100;

  for (let i = 0; i < books.length; i += chunkSize) {
    const chunk = books.slice(i, i + chunkSize);
    const values = chunk.map(() => '(?, ?, ?, ?, ?, ?, ?, ?, ?)').join(', ');
    const params = chunk.flatMap((b) => [
      b.id,
      b.titulo,
      b.autor,
      b.editorial,
      b.precio,
      b.disponibilidad,
      b.genero,
      b.createdAt,
      b.updatedAt,
    ]);

    await sequelize.query(
      `INSERT INTO books (id, titulo, autor, editorial, precio, disponibilidad, genero, "createdAt", "updatedAt") VALUES ${values}`,
      { replacements: params },
    );
  }

  console.log('Base de datos poblada con 1000 libros');
  await sequelize.close();
}

seed().catch(console.error);
