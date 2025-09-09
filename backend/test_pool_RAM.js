//const mysql = require('mysql2');
import { createPool } from 'mysql2/promise';

// Create a connection pool
const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'p3rson4l',
  database: 'FLVEHI',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.prepare('SELECT * FROM flveh_m001 WHERE id = ?');  //prepare the statement
// Use pool.prepare for a prepared statement
const statement = pool.prepare('SELECT * FROM flveh_m001 WHERE id = ?');
statement.execute([1], (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
  } else {
    console.log('Query results:', results);
  }
});

// Execute the prepared statement
statement.execute([1], (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
  } else {
    console.log('Query results:', results);
  }

  // Close the statement after use
  statement.close();
});
