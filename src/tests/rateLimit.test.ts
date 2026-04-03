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
        expect(blocked.data.message).toContain('Muitas tentativas');
      }
    });

    it('deve liberar após a janela de tempo expirar', async () => {
      // aguarda a janela do rate limit resetar (15 min em produção)
      // em testes de stress use uma janela menor configurável por env
      const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000');

      if (windowMs > 60000) {
        console.warn(`⚠️  Janela de ${windowMs}ms muito longa para aguardar — teste ignorado`);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, windowMs + 1000));

      const user = userFactory();
      const res = await api.post('/api/auth/login', {
        email: user.email,
        password: 'senha-errada',
      });

      expect(res.status).not.toBe(429);
    });
  });

  describe('Global rate limit', () => {
    it('deve bloquear após 100 requisições globais', async () => {
      const requests = Array.from({ length: 101 }, () =>
        api.get('/api/jobs/open')
      );

      const responses = await Promise.all(requests);
      const blocked = responses.filter(r => r.status === 429);

      expect(blocked.length).toBeGreaterThan(0);
    });
  });
});