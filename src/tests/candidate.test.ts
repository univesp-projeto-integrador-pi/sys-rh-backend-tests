import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory, candidateFactory } from '../helpers/factories';

describe('Candidates', () => {
  let candidateId: string;

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

  describe('POST /api/candidates', () => {
    it('deve criar candidato com sucesso', async () => {
      const candidate = candidateFactory();
      const res = await api.post('/api/candidates', candidate);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.email).toBe(candidate.email);

      candidateId = res.data.id;
    });

    it('deve retornar 400 quando email já cadastrado', async () => {
      const candidate = candidateFactory();
      await api.post('/api/candidates', candidate);
      const res = await api.post('/api/candidates', candidate);

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('Email já cadastrado');
    });
  });

  describe('GET /api/candidates', () => {
    it('deve listar candidatos', async () => {
      const res = await api.get('/api/candidates');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe('GET /api/candidates/:id', () => {
    it('deve retornar candidato por id', async () => {
      const res = await api.get(`/api/candidates/${candidateId}`);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(candidateId);
    });

    it('deve retornar 404 quando não encontrado', async () => {
      const res = await api.get('/api/candidates/id-inexistente');
      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/candidates/:id', () => {
    it('deve atualizar candidato', async () => {
      const res = await api.put(`/api/candidates/${candidateId}`, {
        fullName: 'Candidato Atualizado',
      });

      expect(res.status).toBe(200);
      expect(res.data.fullName).toBe('Candidato Atualizado');
    });
  });

  describe('DELETE /api/candidates/:id', () => {
    it('deve fazer soft delete do candidato', async () => {
      const res = await api.delete(`/api/candidates/${candidateId}`);
      expect(res.status).toBe(204);
    });
  });
});