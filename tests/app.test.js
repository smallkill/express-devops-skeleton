const request = require('supertest');
const app = require('../app');

describe('app', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('sets security headers and hides x-powered-by', async () => {
    const res = await request(app).get('/health');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['content-security-policy']).toBeDefined();
  });

  it('GET /api/hello greets by name', async () => {
    const res = await request(app).get('/api/hello?name=Derek');
    expect(res.body.message).toBe('Hello, Derek!');
  });

  it('ignores non-string name (array query)', async () => {
    const res = await request(app).get('/api/hello?name=a&name=b');
    expect(res.body.message).toBe('Hello, World!');
  });

  it('returns JSON 404 for unknown routes', async () => {
    const res = await request(app).get('/nope');
    expect(res.status).toBe(404);
    expect(res.body.error).toBe('not_found');
  });

  it('rejects oversized JSON body with 413', async () => {
    const res = await request(app)
      .post('/api/hello')
      .set('content-type', 'application/json')
      .send(JSON.stringify({ x: 'a'.repeat(200 * 1024) }));
    expect(res.status).toBe(413);
  });

  it('rejects malformed JSON with 400 without leaking stack', async () => {
    const res = await request(app)
      .post('/api/hello')
      .set('content-type', 'application/json')
      .send('{bad');
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).not.toMatch(/at .*\.js/);
  });
});
