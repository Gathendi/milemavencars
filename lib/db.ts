import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  password: '12345678',
  host: 'localhost',
  port: 5432,
  database: 'milemaven',
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
    return;
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      console.error('Error executing query', err.stack);
      return;
    }
    console.log('Connected to PostgreSQL database');
  });
});

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
  pool,
}; 