import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory, departmentFactory } from '../helpers/factories';

describe('Departments', () => {
  let departmentId: string;

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

  describe('POST /api/departments', () => {
    it('deve criar departamento com sucesso', async () => {
      const department = departmentFactory();
      const res = await api.post('/api/departments', department);

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.name).toBe(department.name);

      departmentId = res.data.id;
    });

    it('deve retornar 400 quando departamento já existe', async () => {
      const department = departmentFactory();
      await api.post('/api/departments', department);
      const res = await api.post('/api/departments', department);

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('Departamento já cadastrado');
    });

    it('deve retornar 401 sem token', async () => {
      clearAuthToken();
      const res = await api.post('/api/departments', departmentFactory());
      expect(res.status).toBe(401);
      // restaura token
      const login = await api.post('/api/auth/login', {
        email: userFactory().email,
        password: userFactory().password,
      });
      setAuthToken(login.data.accessToken);
    });
  });

  describe('GET /api/departments', () => {
    it('deve listar departamentos', async () => {
      const res = await api.get('/api/departments');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe('GET /api/departments/:id', () => {
    it('deve retornar departamento por id', async () => {
      const res = await api.get(`/api/departments/${departmentId}`);

      expect(res.status).toBe(200);
      expect(res.data.id).toBe(departmentId);
    });

    it('deve retornar 404 quando não encontrado', async () => {
      const res = await api.get('/api/departments/id-inexistente');

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/departments/:id', () => {
    it('deve atualizar departamento', async () => {
      const res = await api.put(`/api/departments/${departmentId}`, {
        name: `Departamento Atualizado ${Date.now()}`,
      });

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /api/departments/:id', () => {
    it('deve deletar departamento', async () => {
      const res = await api.delete(`/api/departments/${departmentId}`);
      expect(res.status).toBe(204);
    });
  });
});