import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory } from '../helpers/factories';

describe('Error Handling', () => {
  beforeAll(async () => {
    const user = userFactory();
    await api.post('/api/auth/register', user);
    const login = await api.post('/api/auth/login', {
      email: user.email,
      password: user.password,
    });
    setAuthToken(login.data.accessToken);
  });

  afterAll(() => clearAuthToken());

  describe('Recursos não encontrados', () => {
    it('deve retornar 404 ao buscar candidato inexistente', async () => {
      const res = await api.get('/api/candidates/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty('message');
    });

    it('deve retornar 404 ao buscar departamento inexistente', async () => {
      const res = await api.get('/api/departments/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty('message');
    });

    it('deve retornar 404 ao buscar vaga inexistente', async () => {
      const res = await api.get('/api/jobs/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.data).toHaveProperty('message');
    });
  });

  describe('Conflitos de dados', () => {
    it('deve retornar 409 ao registrar email já cadastrado', async () => {
      const user = userFactory();
      await api.post('/api/auth/register', user);
      const res = await api.post('/api/auth/register', user);

      expect(res.status).toBe(409);
      expect(res.data.message).toBe('Email já cadastrado');
    });

    it('deve retornar 409 ao criar candidato com email duplicado', async () => {
      const candidate = {
        fullName: 'Candidato Duplicado',
        email: `duplicado_${Date.now()}@email.com`,
      };
      await api.post('/api/candidates', candidate);
      const res = await api.post('/api/candidates', candidate);

      expect(res.status).toBe(409);
      expect(res.data.message).toBe('Email já cadastrado');
    });

    it('deve retornar 409 ao criar departamento com nome duplicado', async () => {
      const dept = { name: `Dept_Duplicado_${Date.now()}` };
      await api.post('/api/departments', dept);
      const res = await api.post('/api/departments', dept);

      expect(res.status).toBe(409);
      expect(res.data.message).toBe('Departamento já cadastrado');
    });
  });

  describe('Respostas de erro sempre têm formato consistente', () => {
    it('deve sempre retornar objeto com campo message em erros 4xx', async () => {
      const responses = await Promise.all([
        api.get('/api/candidates/id-invalido'),
        api.post('/api/candidates', {}),
        api.get('/api/departments/id-invalido'),
      ]);

      responses.forEach(res => {
        expect(res.data).toHaveProperty('message');
        expect(typeof res.data.message).toBe('string');
      });
    });
  });
});