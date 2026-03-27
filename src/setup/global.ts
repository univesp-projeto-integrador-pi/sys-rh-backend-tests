import * as dotenv from 'dotenv';

dotenv.config();

module.exports = async () => {
  console.log('🚀 Iniciando suite de testes...');
  console.log(`📡 API: ${process.env.API_URL}`);
};