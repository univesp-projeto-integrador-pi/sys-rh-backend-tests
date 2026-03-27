import api, { setAuthToken, clearAuthToken } from '../helpers/api';
import {
  userFactory,
  departmentFactory,
  candidateFactory,
  jobPositionFactory,
  jobApplicationFactory,
  internalNoteFactory,
} from '../helpers/factories';

describe('JobApplications', () => {
  let candidateId: string;
  let positionId: string;
  let applicationId: string;
  let userId: string;

  beforeAll(async () => {
    const user = userFactory();
    const register = await api.post('/api/auth/register', user);
    userId = register.data.id;

    const login = await api.post('/api/auth/login', {
      email: user.email,
      password: user.password,
    });
    setAuthToken(login.data.accessToken);

    const dept = await api.post('/api/departments', departmentFactory());
    const position = await api.post('/api/jobs', jobPositionFactory(dept.data.id));
    positionId = position.data.id;

    const candidate = await api.post('/api/candidates', candidateFactory());
    candidateId = candidate.data.id;
  });

  afterAll(() => clearAuthToken());

  describe('POST /api/job-applications', () => {
    it('deve criar candidatura com sucesso', async () => {
      const res = await api.post('/api/job-applications',
        jobApplicationFactory(candidateId, positionId)
      );

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.currentStage).toBe('APPLIED');

      applicationId = res.data.id;
    });

    it('deve retornar 400 quando candidato já se candidatou', async () => {
      const res = await api.post('/api/job-applications',
        jobApplicationFactory(candidateId, positionId)
      );

      expect(res.status).toBe(400);
      expect(res.data.message).toBe('Candidato já se candidatou para esta vaga');
    });
  });

  describe('GET /api/job-applications', () => {
    it('deve listar candidaturas', async () => {
      const res = await api.get('/api/job-applications');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe('PATCH /api/job-applications/:id/stage', () => {
    it('deve avançar etapa da candidatura', async () => {
      const res = await api.patch(`/api/job-applications/${applicationId}/stage`, {
        currentStage: 'SCREENING',
      });

      expect(res.status).toBe(200);
      expect(res.data.currentStage).toBe('SCREENING');
    });
  });

  describe('POST /api/job-applications/:id/notes', () => {
    it('deve adicionar nota na candidatura', async () => {
      const res = await api.post(
        `/api/job-applications/${applicationId}/notes`,
        internalNoteFactory(applicationId, userId)
      );

      expect(res.status).toBe(201);
      expect(res.data).toHaveProperty('id');
      expect(res.data.rating).toBe(4);
    });
  });

  describe('GET /api/job-applications/:id/notes', () => {
    it('deve listar notas da candidatura', async () => {
      const res = await api.get(`/api/job-applications/${applicationId}/notes`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
    });
  });

  describe('DELETE /api/job-applications/:id', () => {
    it('deve fazer soft delete da candidatura', async () => {
      const res = await api.delete(`/api/job-applications/${applicationId}`);
      expect(res.status).toBe(204);
    });
  });
});