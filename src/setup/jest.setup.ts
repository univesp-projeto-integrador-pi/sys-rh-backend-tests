import * as dotenv from 'dotenv';
import { fetchAndSetCsrfToken } from '../helpers/api';

dotenv.config();

jest.setTimeout(30000);

beforeAll(async () => {
  console.log('🚀 Iniciando suite de testes...');
  console.log(`📡 API: ${process.env.API_URL}`);
  await fetchAndSetCsrfToken();
});

afterAll(async () => {
  console.log('✅ Suite de testes finalizada.');
});