import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory } from '../helpers/factories';

describe('Security', () => {
  let validToken: string;
  const user = userFactory();

  beforeAll(async () => {
    await api.post('/api/auth/register', user);
    const login = await api.post('/api/auth/login', {
      email: user.email,
      password: user.password,
    });
    validToken = login.data.accessToken;
  });

  afterAll(() => clearAuthToken());

  describe('Headers de segurança (Helmet)', () => {
    it('deve retornar X-Content-Type-Options', async () => {
      const res = await api.get('/api/jobs/open');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('deve retornar X-Frame-Options', async () => {
      const res = await api.get('/api/jobs/open');
      expect(res.headers['x-frame-options']).toBeDefined();
    });

    it('deve retornar X-XSS-Protection ou Content-Security-Policy', async () => {
      const res = await api.get('/api/jobs/open');
      const hasProtection =
        res.headers['x-xss-protection'] !== undefined ||
        res.headers['content-security-policy'] !== undefined;
      expect(hasProtection).toBe(true);
    });
  });

  describe('Proteção de rotas internas', () => {
    it('deve retornar 401 ao acessar rota interna sem token', async () => {
      clearAuthToken();
      const res = await api.get('/api/departments');
      expect(res.status).toBe(401);
    });

    it('deve retornar 401 com token malformado', async () => {
      api.defaults.headers.common['Authorization'] = 'Bearer token-invalido';
      const res = await api.get('/api/departments');
      expect(res.status).toBe(401);
      clearAuthToken();
    });

    it('deve retornar 401 com token sem prefixo Bearer', async () => {
      api.defaults.headers.common['Authorization'] = validToken;
      const res = await api.get('/api/departments');
      expect(res.status).toBe(401);
      clearAuthToken();
    });

    it('deve permitir acesso com token válido', async () => {
      setAuthToken(validToken);
      const res = await api.get('/api/departments');
      expect(res.status).toBe(200);
      clearAuthToken();
    });
  });

  describe('Rotas públicas acessíveis sem token', () => {
    it('deve acessar GET /api/jobs/open sem autenticação', async () => {
      clearAuthToken();
      const res = await api.get('/api/jobs/open');
      expect(res.status).toBe(200);
    });

    it('deve acessar POST /api/auth/register sem autenticação', async () => {
      const res = await api.post('/api/auth/register', userFactory());
      expect(res.status).toBe(201);
    });

    it('deve acessar POST /api/auth/login sem autenticação', async () => {
      const res = await api.post('/api/auth/login', {
        email: user.email,
        password: user.password,
      });
      expect(res.status).toBe(200);
    });
  });
});