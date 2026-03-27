import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory } from '../helpers/factories';

describe('Auth', () => {
  const user = userFactory();
  let accessToken: string;

  beforeAll(async () => {
    await api.post('/api/auth/register', user);
  });

  afterAll(() => clearAuthToken());

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const newUser = userFactory();
      const res = await api.post('/api/auth/register', newUser);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.email).toBe(newUser.email);
    });

    it('deve retornar 400 quando email já cadastrado', async () => {
      const res = await api.post('/api/auth/register', user);

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('Email já cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login e retornar access token', async () => {
      const res = await api.post('/api/auth/login', {
        email: user.email,
        password: user.password,
      });

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('accessToken');
      expect(res.data.user.email).toBe(user.email);

      accessToken = res.data.accessToken;
      setAuthToken(accessToken);
    });

    it('deve retornar 401 com credenciais inválidas', async () => {
      const res = await api.post('/api/auth/login', {
        email: user.email,
        password: 'senha-errada',
      });

      expect(res.status).toBe(401);
      expect(res.data.message).toBe('Credenciais inválidas');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('deve gerar novo access token', async () => {
      await api.post('/api/auth/login', {
        email: user.email,
        password: user.password,
      });

      const res = await api.post('/api/auth/refresh');

      expect(res.status).toBe(200);
      expect(res.data).toHaveProperty('accessToken');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('deve fazer logout com sucesso', async () => {
      const res = await api.post('/api/auth/logout');
      expect(res.status).toBe(204);
    });
  });
});