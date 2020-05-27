const mysql = require('mysql2/promise')

// const connectDB = async () => {
//   const conn = await mysql.createPool({
//     host: process.env.DB_SERVER,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,    
//   });
//   console.log(`mysql2 Connected: ${conn.connection.host}`.cyan.underline.bold);
// };

// module.exports = connectDB;

module.exports = mysql.createPool({ host: 'localhost', user: 'root', password: '', database: 'chatcord' });
