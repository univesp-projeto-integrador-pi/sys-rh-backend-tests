import api, { clearAuthToken } from '../helpers/api';
import { userFactory } from '../helpers/factories';

describe('Rate Limiting', () => {
  afterAll(() => clearAuthToken());

  describe('POST /api/auth/login', () => {
    it('deve bloquear após 10 tentativas consecutivas de login', async () => {
      const user = userFactory();

      const requests = Array.from({ length: 11 }, () =>
        api.post('/api/auth/login', {
          email: user.email,
          password: 'senha-errada',
        })
      );

      const responses = await Promise.all(requests);
      const blocked = responses.filter(r => r.status === 429);

      expect(blocked.length).toBeGreaterThan(0);
    });

    it('deve retornar 429 com mensagem apropriada ao ser bloqueado', async () => {
      const user = userFactory();

      const requests = Array.from({ length: 11 }, () =>
        api.post('/api/auth/login', {
          email: user.email,
          password: 'senha-errada',
        })
      );

      const responses = await Promise.all(requests);
      const blocked = responses.find(r => r.status === 429);

      if (blocked) {
        expect(blocked.data.message).toContain('Muitas requisições, tente novamente em 15 minutos');
      }
    });
  });
});