import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import { userFactory, departmentFactory } from '../helpers/factories';

describe('Validation', () => {
  let departmentId: string;

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

  describe('POST /api/auth/register', () => {
    it('deve retornar 400 quando name está ausente', async () => {
      const res = await api.post('/api/auth/register', {
        email: 'teste@email.com',
        password: 'Senha@123',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('name');
    });

    it('deve retornar 400 quando email é inválido', async () => {
      const res = await api.post('/api/auth/register', {
        name: 'Teste',
        email: 'email-invalido',
        password: 'Senha@123',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('email');
    });

    it('deve retornar 400 quando senha é fraca (sem maiúscula)', async () => {
      const res = await api.post('/api/auth/register', {
        name: 'Teste',
        email: 'teste@email.com',
        password: 'senha@123',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('password');
    });

    it('deve retornar 400 quando senha é fraca (sem número)', async () => {
      const res = await api.post('/api/auth/register', {
        name: 'Teste',
        email: 'teste@email.com',
        password: 'Senha@abc',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('password');
    });

    it('deve retornar 400 quando senha é fraca (sem especial)', async () => {
      const res = await api.post('/api/auth/register', {
        name: 'Teste',
        email: 'teste@email.com',
        password: 'Senha1234',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('password');
    });

    it('deve retornar 400 quando senha tem menos de 8 caracteres', async () => {
      const res = await api.post('/api/auth/register', {
        name: 'Teste',
        email: 'teste@email.com',
        password: 'S@1',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('password');
    });

    it('deve retornar 400 com múltiplos erros quando vários campos são inválidos', async () => {
      const res = await api.post('/api/auth/register', {});
      expect(res.status).toBe(400);
      expect(res.data.errors.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('POST /api/candidates', () => {
    it('deve retornar 400 quando fullName está ausente', async () => {
      const res = await api.post('/api/candidates', {
        email: 'candidato@email.com',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('fullName');
    });

    it('deve retornar 400 quando email é inválido', async () => {
      const res = await api.post('/api/candidates', {
        fullName: 'Candidato Teste',
        email: 'email-invalido',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('email');
    });

    it('deve retornar 400 quando telefone é inválido', async () => {
      const res = await api.post('/api/candidates', {
        fullName: 'Candidato Teste',
        email: `candidato_${Date.now()}@email.com`,
        phone: '123', // muito curto
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('phone');
    });

    it('deve criar candidato com telefone válido de 11 dígitos', async () => {
      const res = await api.post('/api/candidates', {
        fullName: 'Candidato Teste',
        email: `candidato_${Date.now()}@email.com`,
        phone: '11999999999',
      });
      expect(res.status).toBe(201);
    });

    it('deve criar candidato sem telefone (campo opcional)', async () => {
      const res = await api.post('/api/candidates', {
        fullName: 'Candidato Teste',
        email: `candidato_${Date.now()}@email.com`,
      });
      expect(res.status).toBe(201);
    });
  });

  describe('POST /api/jobs', () => {
    it('deve retornar 400 quando title está ausente', async () => {
      const res = await api.post('/api/jobs', {
        departmentId,
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('title');
    });

    it('deve retornar 400 quando departmentId não é UUID válido', async () => {
      const res = await api.post('/api/jobs', {
        title: 'Dev Backend',
        departmentId: 'id-invalido',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('departmentId');
    });

    it('deve retornar 400 quando title tem menos de 3 caracteres', async () => {
      const res = await api.post('/api/jobs', {
        title: 'AB',
        departmentId,
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('title');
    });
  });

  describe('POST /api/job-applications', () => {
    it('deve retornar 400 quando candidateId não é UUID', async () => {
      const res = await api.post('/api/job-applications', {
        candidateId: 'id-invalido',
        positionId: departmentId,
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('candidateId');
    });

    it('deve retornar 400 quando positionId não é UUID', async () => {
      const res = await api.post('/api/job-applications', {
        candidateId: departmentId,
        positionId: 'id-invalido',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('positionId');
    });

    it('deve retornar 400 quando ambos os campos estão ausentes', async () => {
      const res = await api.post('/api/job-applications', {});
      expect(res.status).toBe(400);
      expect(res.data.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('PATCH /api/job-applications/:id/stage', () => {
    it('deve retornar 400 quando currentStage é valor inválido', async () => {
      const res = await api.patch(`/api/job-applications/${departmentId}/stage`, {
        currentStage: 'INVALID_STAGE',
      });
      expect(res.status).toBe(400);
      expect(res.data.errors[0].field).toBe('currentStage');
    });
  });
});