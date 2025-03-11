const mysql = require('mysql2/promise');

// Configuração inicial do banco de dados
const dbConfig = {
  host: `${process.env.DB_HOST}`, // Endereço do banco de dados
  user: `${process.env.DB_USER}`,         // Nome do usuário
  password: `${process.env.DB_PASS}`,     // Senha do banco de dados
  database: `${process.env.DB_NAME}`, // Nome do banco de dados
};

// Criar pool de conexões
const pool = mysql.createPool(dbConfig);

// Verificar conexão
pool.getConnection()
  .then(connection => {
    console.log('Conectado ao banco de dados.');
    connection.release();
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  });

// Exporta o pool para ser usado em outros módulos
module.exports = pool;
