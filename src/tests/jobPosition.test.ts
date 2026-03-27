import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory, departmentFactory, jobPositionFactory } from '../helpers/factories';

describe('JobPositions', () => {
  let departmentId: string;
  let positionId: string;

  beforeAll(async () => {
    const user = userFactory();
    await api.post('/api/auth/register', user);
    const login = await api.post('/api/auth/login', {
      email: user.email,
      password: user.password,
    });
    setAuthToken(login.data.accessToken);

    const dept = await api.post('/api/departments', departmentFactory());
    departmentId = dept.data.id;
  });

  afterAll(() => clearAuthToken());

  describe('POST /api/jobs', () => {
    it('deve criar vaga com sucesso', async () => {
      const position = jobPositionFactory(departmentId);
      const res = await api.post('/api/jobs', position);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.title).toBe(position.title);

      positionId = res.data.id;
    });

    it('deve retornar 400 quando departamento não existe', async () => {
      const res = await api.post('/api/jobs', jobPositionFactory('id-inexistente'));
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/jobs/open', () => {
    it('deve listar apenas vagas abertas — rota pública', async () => {
      clearAuthToken();
      const res = await api.get('/api/jobs/open');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      res.data.forEach((job: any) => {
        expect(job.status).toBe('OPEN');
      });
    });
  });

  describe('GET /api/jobs/:id', () => {
    it('deve retornar vaga por id', async () => {
      const res = await api.get(`/api/jobs/${positionId}`);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(positionId);
    });
  });

  describe('PUT /api/jobs/:id', () => {
    it('deve atualizar status da vaga', async () => {
      const login = await api.post('/api/auth/login', {
        email: userFactory().email,
        password: userFactory().password,
      });
      setAuthToken(login.data.accessToken);

      const res = await api.put(`/api/jobs/${positionId}`, {
        status: 'PAUSED',
      });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/jobs/:id', () => {
    it('deve deletar vaga', async () => {
      const res = await api.delete(`/api/jobs/${positionId}`);
      expect(res.status).toBe(204);
    });
  });
});