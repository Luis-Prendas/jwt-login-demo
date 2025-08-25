// tests/app.test.ts
import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
  it('GET / debe responder con el mensaje de healthcheck', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('🚀 API con JWT en TypeScript funcionando correctamente!');
  });
});
